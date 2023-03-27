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
