const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/submit", (req, res) => {
  const newData = req.body;

  fs.readFile("db.json", (err, data) => {
    if (err && err.code === "ENOENT") {
      // If db.json does not exist, create it
      fs.writeFile("db.json", JSON.stringify([newData], null, 2), (err) => {
        if (err) {
          return res.status(500).send("Error writing to file");
        }
        res.status(200).send("Data saved");
      });
    } else if (err) {
      return res.status(500).send("Error reading file");
    } else {
      // If db.json exists, read it and update it
      const jsonData = JSON.parse(data);
      jsonData.push(newData);
      fs.writeFile("db.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Error writing to file");
        }
        res.status(200).send("Data saved");
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${URL_TAREFAS}`);
  console.log(`Server is running on ${URL_NOTAS}`);
});
