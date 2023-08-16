const express = require("express");
const { getTopics } = require("./controllers/topics.controllors");
const { getApiData } = require("./controllers/api.controllors");
const { getArticleId } = require("./controllers/articles.id.controllors");
const { getArticles } = require("./controllers/allArticles.controllors");
const {
  getCommentsByArticleId,
} = require("./controllers/articleIdComments.controllors");
const {
  postCommentsByArticleId,
} = require("./controllers/postCommentById.controllor");

const {
  updateArticleVote,
} = require("./controllers/articleIDPatch.controllors");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./error");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/", getApiData);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);
app.patch("/api/articles/:article_id", updateArticleVote); // Remove the trailing slash

app.all("*", (_, res) => {
  res.status(400).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
