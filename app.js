const express = require("express");
const { getTopics } = require("./controllers/topics.controllors");
const { getApiData } = require("./controllers/api.controllors");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/", getApiData);

module.exports = app;
