// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const cliSpinners = require("cli-spinners");

// const callSpinner = (page) => {
//   const spinner = cliSpinners[process.argv[2] || "dots"];
//   let i = 0;

//   setInterval(() => {
//     const { frames } = spinner;
//     console.log(frames[(i = ++i % frames.length)] + " current page:", page);
//   }, spinner.interval);
// };
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   let currentPage = 4;
//   const maxPages = 4; // Set this to the maximum number of pages you wish to scrape
//   let allData = [];

//   while (currentPage <= maxPages) {
//     const url = `https://bharat-tex.com/exhibitorlist/exhibitor_info.php?page=${currentPage}`;
//     await page.goto(url, { waitUntil: "networkidle2" });

//     callSpinner(currentPage);
//     // Extract data from the table
//     const data = await page.evaluate(() => {
//       const rows = Array.from(document.querySelectorAll(".table-striped tr"));
//       return rows
//         .map((row) => {
//           const columns = row.querySelectorAll("td");
//           return Array.from(columns, (column) => column.innerText);
//         })
//         .filter((row) => row.length > 0); // Filter out empty rows
//     });

//     console.log(`Page ${currentPage} Data:`, data);
//     allData.push(...data);
//     // console.log(cliSpinners.dots10, "Scraping data at page...", currentPage);

//     currentPage++;
//   }

//   // Save the data to a JSON file
//   fs.writeFile("scraped_data.json", JSON.stringify(allData, null, 2), (err) => {
//     if (err) throw err;
//     console.log("Data saved to scraped_data.json");
//   });

//   await browser.close();
// })();

const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const maxPages = 2000;
(async function scrapeData() {
  let driver = await new Builder().forBrowser("chrome").build();
  let allData = [];
  let pageNumber = 1492;
  try {
    for (; pageNumber <= maxPages; pageNumber++) {
      await driver.get(
        `https://bharat-tex.com/exhibitorlist/exhibitor_info.php?page=${pageNumber}`
      );

      // Wait for the table to load
      let table = await driver.wait(
        until.elementLocated(By.className("table-striped")),
        5000000
      );
      let rows = await table.findElements(By.tagName("tr"));

      // Skip the first row if it's headers
      for (let i = 1; i < rows.length; i++) {
        let cols = await rows[i].findElements(By.tagName("td"));
        let rowData = {};
        for (let j = 0; j < cols.length; j++) {
          // Assuming the headers are fixed and known ahead of time, or use j as key
          rowData[`column${j}`] = await cols[j].getText();
        }
        allData.push(rowData);
      }
    }

    fs.writeFileSync(
      `./data/scrapedData-page-${pageNumber}-${Date.now()}.json`,
      JSON.stringify(allData, null, 2),
      "utf-8"
    );
    console.log("Data saved to scrapedData.json");
  } catch (error) {
    fs.writeFileSync(
      `./data/scrapedData-page-${pageNumber}-${Date.now()}.json`,
      JSON.stringify(allData, null, 2),
      "utf-8"
    );
    console.log("exception while reading page", error);
  } finally {
    await driver.quit();
  }
})();
