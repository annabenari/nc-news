const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");

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
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });

  test("should return a 404 status code for an article that doesn't exist", () => {
    const nonExistentArticleId = 76;

    return request(app)
      .get(`/api/articles/${nonExistentArticleId}`)
      .expect(404);
  });

  test("should return the article details for an existing article", () => {
    const existingArticleId = 6;

    return request(app)
      .get(`/api/articles/${existingArticleId}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.articles)).toBe(false);
        expect(response.body.articles[0]).toHaveProperty("author");
        expect(response.body.articles[0]).toHaveProperty("title");
        expect(response.body.articles[0]).toHaveProperty(
          "article_id",
          existingArticleId
        );
        expect(response.body.articles[0]).toHaveProperty("body");
        expect(response.body.articles[0]).toHaveProperty("topic");
        expect(response.body.articles[0]).toHaveProperty("created_at");
        expect(response.body.articles[0]).toHaveProperty("votes");
        expect(response.body.articles[0]).toHaveProperty("article_img_url");
      });
  });
});

test("should return the article details for an existing article", () => {
  const anotherExistingArticleId = 1;

  return request(app)
    .get(`/api/articles/${anotherExistingArticleId}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.articles)).toBe(false);
    });
});

describe("GET /api/articles/", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles/").expect(200);
  });

  test("should return an array", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
        expect(response.body.articles.length).toBeGreaterThan(0);
        response.body.articles.forEach((article) => {
          expect(typeof article).toBe("object");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  const anotherExistingArticleId = 1;

  test("should return a 200 status code", () => {
    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}/comments`)
      .expect(200);
  });

  test("should return the article comment details for an existing article", () => {
    return request(app)
      .get(`/api/articles/${anotherExistingArticleId}/comments`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.comments)).toBe(true);
      });
  });

  test("should return a 404 status code for an article that doesn't exist", () => {
    const nonExistentArticleId = 76;

    return request(app)
      .get(`/api/articles/${nonExistentArticleId}/comments`)
      .expect(404);
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

// describe(" PATCH /api/articles/:article_id", () => {
//   test("should update an article by incrementing votes", () => {
//     const articleId = 1;
//     const newVotes = 5;

//     return request(app)
//       .patch(`/api/articles/${articleId}`)
//       .send({ inc_votes: newVotes })
//       .expect(200)
//       .then((response) => {
//         const updatedArticle = response.body.article;
//         console.log(updatedArticle);
//         expect(updatedArticle[0].votes).toBe(initialVoteCount + newVotes);
//       });
//   });

//   test("should update an article by decrementing votes", () => {
//     const articleId = 2;
//     const newVotes = -3;

//     return request(app)
//       .patch(`/api/articles/${articleId}`)
//       .send({ inc_votes: newVotes })
//       .expect(200)
//       .then((response) => {
//         const updatedArticle = response.body.article;
//         expect(updatedArticle.votes).toBe(initialVoteCount + newVotes);
//       });
//   });
//   test("should return a 400 error for an invalid vote increment", () => {
//     const articleId = 3;
//     const invalidVotes = "invalid";

//     return request(app)
//       .patch(`/api/articles/${articleId}`)
//       .send({ inc_votes: invalidVotes })
//       .expect(400);
//   });

//   test("should return a 404 error for a non-existing article", () => {
//     const nonExistingArticleId = 999;

//     return request(app)
//       .patch(`/api/articles/${nonExistingArticleId}`)
//       .send({ inc_votes: 1 })
//       .expect(404);
//   });
// });
