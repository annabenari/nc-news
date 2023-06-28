const db = require("../db/connection");

function getCommentsByArticleId(id) {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
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
      console.log("Error executing getCommentsByArticleId:", error);
      throw error;
    });
}

module.exports = {
  getCommentsByArticleId,
};
