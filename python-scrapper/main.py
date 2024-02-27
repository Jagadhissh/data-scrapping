from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import json

# Setup Selenium WebDriver
options = webdriver.ChromeOptions()
options.add_argument('headless')  # Run in background
driver = webdriver.Chrome(options=options)
maxPages=2
def scrape_table(page_number):
    url = f"https://bharat-tex.com/exhibitorlist/exhibitor_info.php?page={page_number}"
    driver.get(url)
    
    # Wait for the page to load
    time.sleep(2)  # Adjust the sleep time as necessary
    
    # Find the table by its class
    table = driver.find_element(By.CLASS_NAME, 'table-striped')
    
    # Extracting data from the table
    # Assuming the first row is headers
    headers = [th.text for th in table.find_elements(By.TAG_NAME, 'th')]
    rows = table.find_elements(By.TAG_NAME, 'tr')
    
    data = []
    for row in rows[1:]:  # Skip header row
        cols = row.find_elements(By.TAG_NAME, 'td')
        row_data = [col.text for col in cols]
        print(row_data) 

        data.append(dict(zip(headers, row_data)))
    
    return data

# Aggregate data from all pages
all_data = []
page_number = 1
while True:
    data = scrape_table(page_number)
    all_data.extend(data)
    print(f"Page {page_number} data scraped.")
    
    page_number += 1
    if page_number > maxPages:  # Assuming you want to stop after a specific page
        break

# Save the data into a JSON file
with open('scraped_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)

print("Data saved to 'scraped_data.json'.")

# Don't forget to close the driver after your scraping job is done
driver.quit()
