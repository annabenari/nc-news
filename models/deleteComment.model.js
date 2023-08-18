const db = require("../db/connection");
const { selectCommentId } = require("./comment.model");

function deleteCommentByCommentId(comment_id) {
  return selectCommentId(comment_id).then(() => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
  });
}

module.exports = {
  deleteCommentByCommentId,
};
