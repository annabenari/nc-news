const db = require("../db/connection");
const { selectArticleId } = require("./articles.model");

function updateArticleVote(article_Id, voteIncrement) {
  return selectArticleId(article_Id).then(() => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [voteIncrement, article_Id]
      )
      .then((updatedArticle) => {
        return updatedArticle.rows;
      });
  });
}

module.exports = {
  updateArticleVote,
};
