const { getCommentsByArticleId } = require("../models/comments.model");

exports.getArticleIdComments = (req, res, next) => {
  const id = req.params.article_id;
  getCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      console.log("Error in getArticleIdComments:", error);
      next(error);
    });
};
