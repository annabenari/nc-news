const db = require("../db/connection");

function selectArticleId(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((result) => {
      const articles = result.rows;
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article id: ${id}`,
        });
      }
      return articles;
    })
    .catch((error) => {
      console.error("Error executing selectArticleId:", error);
      throw error;
    });
}

module.exports = {
  selectArticleId,
};
