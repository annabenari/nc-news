const { selectArticleId } = require("../models/articles.model");

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
