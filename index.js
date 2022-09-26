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
const tableName = "BaiBao";
const multer = require("multer");
const upload = multer();

app.post("/", upload.fields([]), (req, res) => {
  const { id, ten_bb, ten_ntg, chi_so, so_trang, nam_xb } = req.body;

  const params = {
    TableName: tableName,
    Item: {
      id,
      ten_bb,
      ten_ntg,
      chi_so,
      so_trang,
      nam_xb,
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

app.get("/", (request, response) => {
  const params = {
    TableName: tableName,
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      response.send("Internal ServerError");
    } else {
      return response.render("index", { baiBaos: data.Items });
    }
  });
});

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

app.listen(3000);
