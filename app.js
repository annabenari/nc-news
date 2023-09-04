const cors = require("cors");
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
  patchArticleVote,
} = require("./controllers/articleIDPatch.controllors");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./error");
const {
  deleteCommentByCommentId,
} = require("./controllers/deleteComment.controllor");
const { getUsers } = require("./controllers/allUsers.controller");

app.use(cors());

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/", getApiData);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleVote);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("*", (_, res) => {
  res.status(400).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
