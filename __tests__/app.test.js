const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const { response } = require("../app");
let articles = require("../db/data/test-data/articles");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("should return a 400 status code if path does not exist", () => {
    return request(app).get("/api/space").expect(400);
  });

  test("should retrieve all topics and return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.topics)).toBe(true);
        expect(response.body.topics.length).toBe(3);

        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic.slug).toEqual(expect.any(String));
          expect(topic).toHaveProperty("description");
          expect(topic.description).toEqual(expect.any(String));
        });
      });
  });
});

describe("GET /api/", () => {
  test("should return a 400 status code if path does not exist", () => {
    return request(app).get("/api/space").expect(400);
  });

  test("should have a description of all endpoints", () => {
    const endpointJson = require("../endpoints.json");

    return request(app)
      .get("/api/")
      .expect(200)
      .then((response) => {
        expect(response.body.api).toEqual(endpointJson);

        Object.values(response.body.api).forEach((api) => {
          expect(api).toHaveProperty("description");
          expect(api.description).toEqual(expect.any(String));
          expect(api).toHaveProperty("queries");
          expect(api.queries).toEqual(expect.any(Array));
          expect(api).toHaveProperty("exampleResponse");
          expect(api.exampleResponse).toEqual(expect.any(Object));
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return a 404 status code for an article that doesn't exist", () => {
    const nonExistentArticleId = 76;

    return request(app)
      .get(`/api/articles/${nonExistentArticleId}`)
      .expect(404);
  });

  test("should return a 400 status code for an article that doesn't exist", () => {
    const notANumber = "space";
    return request(app).get(`/api/articles/${notANumber}`).expect(400);
  });

  test("should return the article details for an existing article", () => {
    const existingArticleId = 6;

    return request(app)
      .get(`/api/articles/${existingArticleId}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
        expect(response.body.articles[0]).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "A",
            article_id: existingArticleId,
            body: "Delicious tin of cat food",
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: 0,
          })
        );
      });
  });

  test("Checking if it returns the objects expected", () => {
    const anotherExistingArticleId = 1;

    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
      });
  });

  describe("GET /api/articles/", () => {
    test("should return expected objects", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .expect((response) => {
          expect(response.body.articles[0]).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: 2,
            })
          );
        });
    });
  });

  test("should ordered by date descending", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .expect((response) => {
        let body = response.body.articles;
        for (let i = 1; i < body.length; i++) {
          expect(Date.parse(body[i].created_at)).toBeLessThanOrEqual(
            Date.parse(body[i - 1].created_at)
          );
        }
      });
  });

  test("does not have a body property", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .expect((response) => {
        response.body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

test("should return length of articles response array", () => {
  return request(app)
    .get(`/api/articles/`)
    .then((response) => {
      expect(response.body.articles.length).toBe(13);
    });
});

describe("GET /api/articles/:article_id/comments", () => {
  const anotherExistingArticleId = 1;

  test("should return a 200 status code", () => {
    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}/comments`)
      .expect(200);
  });

  test("should return a 404 status code for an article that doesn't exist", () => {
    const nonExistentArticleId = 76;

    return request(app)
      .get(`/api/articles/${nonExistentArticleId}/comments`)
      .expect(404);
  });

  test("should return the article comment details for an existing article", () => {
    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}/comments`)
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(Array.isArray(response.body.comments)).toBe(true);
        expect(comments.length).toBe(11);

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment.comment_id).toEqual(expect.any(Number));
          expect(comment).toHaveProperty("author");
          expect(comment.author).toEqual(expect.any(String));
          expect(comment).toHaveProperty("body");
          expect(comment.body).toEqual(expect.any(String));
        });
      });
  });

  test("should ordered by date descending", () => {
    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}/comments`)
      .expect(200)
      .expect((response) => {
        let body = response.body.comments;
        for (let i = 1; i < body.length; i++) {
          expect(Date.parse(body[i].created_at)).toBeLessThanOrEqual(
            Date.parse(body[i - 1].created_at)
          );
        }
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should return a 201 status code", () => {
    const articleId = 1;
    const commentData = {
      username: "butter_bridge",
      body: "Testing",
    };

    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(commentData)
      .expect(201)
      .then((response) => {
        const comment = response.body.comments;
        expect(comment[0].author).toBe("butter_bridge");
        expect(comment[0].body).toBe("Testing");
      });
  });
});

test("should return a 500 status code", () => {
  const articleId = 1;
  const commentData = {
    username: "Anna123",
    body: "Testing",
  };

  return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(commentData)
    .expect(500);
});

test("should return a 404 status code for invalid article ID", () => {
  const articleId = 999;
  const commentData = {
    username: "Anna123",
    body: "Testing",
  };

  return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(commentData)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe(`Article not found for ID: ${articleId}`);
    });
});

test("should return a 400 status code for missing required fields", () => {
  const articleId = 1;
  const invalidCommentData = {};

  return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send(invalidCommentData)
    .expect(400)
    .expect((response) => {
      expect(response.body.msg).toBe("Bad Request - Missing required fields");
    });
});

describe(" PATCH /api/articles/:article_id", () => {
  test("should update an article by incrementing votes", async () => {
    const articleId = 1;
    const newVotes = 5;
    const initialVoteCount = articles[0].votes;

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: newVotes })
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle[0].votes).toBe(initialVoteCount + newVotes);
      });
  });

  test("should update an article by decrementing votes", () => {
    const articleId = 2;
    const newVotes = -3;
    const initialVoteCount = articles[1].votes || 0;

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: newVotes })
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle[0].votes).toBe(initialVoteCount + newVotes);
      });
  });
  test("should return a 400 error for an invalid vote increment", () => {
    const articleId = 3;
    const invalidVotes = "invalid";

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ inc_votes: invalidVotes })
      .expect(400);
  });

  test("should return a 404 error for a non-existing article", () => {
    const nonExistingArticleId = 999;

    return request(app)
      .patch(`/api/articles/${nonExistingArticleId}`)
      .send({ inc_votes: 1 })
      .expect(404);
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete the given comment by comment_id and respond with status 204", () => {
    const commentIdToDelete = 1;

    return request(app)
      .delete(`/api/comments/${commentIdToDelete}`)
      .expect(204);
  });

  test("should respond with  404 if commentid doesn't exist", () => {
    const nonExistentCommentId = 999;

    return request(app)
      .delete(`/api/comments/${nonExistentCommentId}`)
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe(
          `Comment not found for ID: ${nonExistentCommentId}`
        );
      });
  });

  test("should respond status 400 if commentid is invalid", () => {
    const invalidCommentId = "invalid_id";

    return request(app)
      .delete(`/api/comments/${invalidCommentId}`)
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Bad Request");
      });
  });
});
