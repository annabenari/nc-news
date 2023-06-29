const db = require("../db/connection");

function selectAllArticles() {
  return db
    .query(
      `
      SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
      FROM 
        articles
        LEFT JOIN
        comments ON articles.article_id = comments.article_id
      GROUP BY
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url
      ORDER BY
        articles.created_at DESC;
    `
    )
    .then((result) => {
      const articles = result.rows;
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles found.",
        });
      }
      return articles;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  selectAllArticles,
};
