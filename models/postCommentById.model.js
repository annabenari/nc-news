const db = require("../db/connection");

function postCommentsByArticleId(id, commentData) {
  const { username, body } = commentData;
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found for ID: ${id}`,
        });
      }
      if (!username || !body) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request - Missing required fields",
        });
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body)
          VALUES ($1, $2, $3)
          RETURNING *`,
        [id, username, body]
      );
    })
    .then((result) => {
      const comments = result.rows;
      return comments;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  postCommentsByArticleId,
};
