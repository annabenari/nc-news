const express = require("express");
const { getTopics } = require("./controllers/topics.controllors");
const { getApiData } = require("./controllers/api.controllors");
const { getArticleId } = require("./controllers/articles.id.controllors");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/", getApiData);
app.get("/api/articles/:article_id", getArticleId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
