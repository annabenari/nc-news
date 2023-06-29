const { getCommentsByArticleId } = require("../models/articleIdComments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  getCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
