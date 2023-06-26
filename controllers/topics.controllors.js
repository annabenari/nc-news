const { selectTopicsFromDatabase } = require("../models/topics.model");

exports.getTopics = (req, res) => {
  selectTopicsFromDatabase().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};
