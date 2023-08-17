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
          console.log(response.body.articles[0]);
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

  test("should return articles ordered by date descending", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .expect((response) => {
        const articles = response.body.articles;
        const sortedDates = articles
          .map((article) => article.created_at)
          .sort((a, b) => new Date(b) - new Date(a));
        expect(articles.map((article) => article.created_at)).toEqual(
          expect.arrayContaining(sortedDates)
        );
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
        console.log(body);
        for (let i = 1; i < body.length; i++) {
          expect(Date.parse(body[i].created_at)).toBeLessThanOrEqual(
            Date.parse(body[i - 1].created_at)
          );
        }
      });
  });
});
