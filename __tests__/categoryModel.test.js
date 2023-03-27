const Category = require("../models/categoryModel");
const { categoryData } = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Category", () => {
  describe("find()", () => {
    it("should resolve with category array", () => {
      return Category.find().then((categories) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(categoryData.length);
      });
    });

    it("each category should have the correct keys", () => {
      return Category.find().then((categories) => {
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug", expect.any(String));
          expect(category).toHaveProperty("description", expect.any(String));
        });
      });
    });
  });
});
