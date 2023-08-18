const db = require("../db/connection");

function selectCommentId(id) {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [id])
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for ID: ${id}`,
        });
      }
      return comments;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  selectCommentId,
};
