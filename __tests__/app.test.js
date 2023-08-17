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

  test("should ordered by date descending", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .expect((response) => {
        let body = response.body.articles;
        console.log(body);
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
