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
          COUNT(comments.article_id) AS comment_count
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

      return articles.map((article) => {
        return {
          author: article.author,
          title: article.title,
          article_id: article.article_id,
          topic: article.topic,
          created_at: article.created_at,
          votes: article.votes,
          article_img_url: article.article_img_url,
          comment_count: parseInt(article.comment_count),
        };
      });
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  selectAllArticles,
};
