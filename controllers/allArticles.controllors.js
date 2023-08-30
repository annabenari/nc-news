const { selectAllArticles } = require("../models/allArticles.model");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by = "created_at", order = "desc" } = req.query;

  const queryParams = { topic, sort_by, order };

  return selectAllArticles(queryParams)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};
