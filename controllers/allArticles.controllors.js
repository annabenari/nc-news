const { selectAllArticles } = require("../models/allArticles.model");

exports.getArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      console.log("Error in getArticles:", error);
      next(error);
    });
};
