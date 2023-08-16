const db = require("../db/connection");

function updateArticleVote(article_Id, voteIncrement) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [voteIncrement, article_Id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows;
    });
}

module.exports = {
  updateArticleVote,
};
