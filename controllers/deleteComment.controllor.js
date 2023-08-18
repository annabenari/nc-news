const db = require("../db/connection");
const { deleteCommentByCommentId } = require("../models/deleteComment.model");

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentId(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};
