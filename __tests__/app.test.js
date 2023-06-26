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
  //Checks it comes back with an ok code

  //test if path doesnt excist = error test

  test("should retrieve all topics and return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(3);
        expect(response.body[0]).toHaveProperty("slug");
        expect(response.body[0]).toHaveProperty("description");
      });
  });
});
//Checks that it returns an array
