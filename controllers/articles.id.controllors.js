const { selectArticleId } = require("../models/articles.model");

exports.getArticleId = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleId(id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      console.error("Error in getArticleId:", error);
      next(error);
    });
};
