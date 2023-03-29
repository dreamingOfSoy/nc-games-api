const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data");
const { categoryData, reviewData } = require("../db/data/test-data/index");

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
        const { categories } = res.body;

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

describe("GET /api/reviews/:review_id", () => {
  it("200 - should respond with correct status code and contain correct feilds", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        const {
          review: [review],
        } = res.body;

        expect(review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  it("404 - should respond with correct status code and contain an empty array when no entry is found", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("review not found");
      });
  });

  it("400 - should respond with correct status code when inputting incorrect review id", () => {
    return request(app)
      .get("/api/reviews/wrong")
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "'/api/reviews/wrong' constains an invalid input parameter"
        );
      });
  });
});

describe("GET /api/reviews", () => {
  it("200 - should respond with correct status code and contain correct feilds", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;

        expect(reviews).toHaveLength(reviewData.length);

        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("200 - shoud repsond with reviews in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;

        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("200 - should respond with an array of comments for a given review and contain the correct properties", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  it("200 - comments should be in ascending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toBeSortedBy("created_at");
      });
  });
  it("200 - should repond with an empty array if no comments exist for that review", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toHaveLength(0);
      });
  });
  it("404 - should respond with a 404 if review is not in the db", () => {
    return request(app)
      .get("/api/reviews/999999/comments")
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("review not found");
      });
  });
});
