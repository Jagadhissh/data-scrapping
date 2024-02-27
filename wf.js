const fs = require("fs");

fs.writeFileSync(
  "./data/raasavika-test.json",
  JSON.stringify([{ name: "Testting automation" }], null, 2),
  "utf-8"
);
