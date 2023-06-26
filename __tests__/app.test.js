const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
// It ensures that the tests start with a predefined dataset or configuration, providing consistent results and avoiding interference between test cases.

afterAll(() => db.end());
//This ensures that the database connection is properly closed once all the tests have finished running, preventing resource leaks or unnecessary connections.

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
        console.log(response.body);
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
