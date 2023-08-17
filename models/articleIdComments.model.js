const db = require("../db/connection");

function getCommentsByArticleId(id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY
    comments.created_at DESC;`,
      [id]
    )
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article id: ${id}`,
        });
      }
      return comments;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  getCommentsByArticleId,
};
