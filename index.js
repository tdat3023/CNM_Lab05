const express = require("express");
const app = express();
app.use(express.json({ extended: false }));
app.use(express.static("./views"));
app.set("view engine", "ejs");
app.set("views", "./views");

//config aws dynamoDB
const AWS = require("aws-sdk");
const config = new AWS.Config({
  accessKeyId: "AKIAVHWOLXXLMYJUEEXG",
  secretAccessKey: "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",
  region: "ap-southeast-1",
});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "newpapers";
const multer = require("multer");
const upload = multer();

//create a new item
app.post("/add", upload.fields([]), (req, res) => {
  const { id, name, author, ISMB, pages, year } = req.body;
  console.log(req.body);
  const params = {
    TableName: tableName,
    Item: {
      id,
      name,
      author,
      ISMB,
      pages,
      year,
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      res.send("Internal Server Error");
    } else {
      return res.redirect("/");
    }
  });
});

// delete one item
app.post("/delete", upload.fields([]), (req, res) => {
  const { id } = req.body;
  const params = {
    TableName: tableName,
    Key: {
      id,
    },
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      res.send("Internal Server Error");
    } else {
      return res.redirect("/");
    }
  });
});

// get table data
app.get("/", (request, response) => {
  const params = {
    TableName: tableName,
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      response.send("Internal ServerError");
    } else {
      return response.render("home", { data: data.Items });
    }
  });
});

app.get("/add", (req, res) => {
  return res.render("addPost");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
