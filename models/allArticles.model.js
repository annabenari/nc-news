const db = require("../db/connection");

function selectAllArticles(queryParams) {
  let query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (queryParams.topic) {
    query += ` WHERE topic = $1`;
  }

  query += `
    GROUP BY articles.article_id
    ORDER BY ${queryParams.sort_by} ${queryParams.order}
  `;
  return db
    .query(query, queryParams.topic ? [queryParams.topic] : [])
    .then((result) => {
      const articles = result.rows;
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
    });
}

module.exports = {
  selectAllArticles,
};
