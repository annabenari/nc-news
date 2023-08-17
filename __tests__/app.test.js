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
  test("should return a 404 status code if path does not excist", () => {
    return request(app).get("/api/space").expect(404);
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
        });

        response.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic.description).toEqual(expect.any(String));
        });
      });
  });
});

describe("GET /api/", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/").expect(200);
  });
  test("should return a 404 status code if path does not excist", () => {
    return request(app).get("/api/space").expect(404);
  });
  test("should have a description of all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpointJson = require("../endpoints.json");
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
