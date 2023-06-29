const { postCommentsByArticleId } = require("../models/postCommentById.model");

exports.postCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const commentData = req.body;
  postCommentsByArticleId(id, commentData)
    .then((comments) => {
      res.status(201).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
