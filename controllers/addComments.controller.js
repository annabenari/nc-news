const { createComment } = require("../models/addComments.model");

exports.addComment = (req, res, next) => {
  const id = req.params.article_id;
  const { username, body } = req.body;
  createComment(articleId, username, body)
    .then(() => {
      res.status(201).send({ message: "Comment created successfully" });
    })
    .catch((error) => {
      console.log("Error in addComment:", error);
      next(error);
    });
};
