const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data");
const { categoryData } = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("ALL /api/wrong-path", () => {
  it("404 - should respond with the correct status code and message if given a url that is not available on this server", () => {
    return request(app)
      .get("/api/wrong-path")
      .expect(404)
      .then((res) => {
        const { error } = res.body;
        expect(error).toBe("/api/wrong-path is not available on this server");
      });
  });
});

describe("GET /api/categories", () => {
  it("200 - should respond with correct status code and contain correct feilds (slug, description)", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const { data: categories } = res.body;

        expect(categories).toHaveLength(categoryData.length);

        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
