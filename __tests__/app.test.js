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
          "'/api/reviews/wrong' contains an invalid input parameter"
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
            review_id: 3,
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
  it("400 - should respond with correct status code when inputting incorrect review id", () => {
    return request(app)
      .get("/api/reviews/toast/comments")
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "'/api/reviews/toast/comments' contains an invalid input parameter"
        );
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

describe("POST /api/reviews/:review_id/comments", () => {
  it("201 - should respond with the correct status code and posted comment", () => {
    const commentToAdd = {
      username: "dav3rid",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToAdd)
      .expect(201)
      .then((res) => {
        const {
          comment: [comment],
        } = res.body;

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          review_id: 3,
        });
      });
  });
  it("201 - should respond with 1 added to the length of the comments for that review", () => {
    const commentToAdd = {
      username: "dav3rid",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToAdd)
      .expect(201)
      .then(() => {
        return request(app)
          .get("/api/reviews/3/comments")
          .then((res) => {
            const { comments } = res.body;

            expect(comments).toHaveLength(4);
          });
      });
  });
  it("201 - should respond with the correct values added", () => {
    const commentToAdd = {
      username: "dav3rid",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToAdd)
      .expect(201)
      .then((res) => {
        const {
          comment: [comment],
        } = res.body;

        expect(comment.author).toBe("dav3rid");
        expect(comment.body).toBe("great review!");
      });
  });
  it("422 - should response with the correct status code when wrong input is given", () => {
    const commentToAdd = {
      username: "dav3rid",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToAdd)
      .expect(422)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("A comment must have both a body and a username");
      });
  });
  it("404 - should respond with correct status code when username does not exists", () => {
    const commentToAdd = {
      username: "user4987387",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/3/comments")
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("user4987387 does not exist");
      });
  });
  it("400 - should respond with correct status code when inputting incorrect review id", () => {
    const commentToAdd = {
      username: "dav3rid",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/toast/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "'/api/reviews/toast/comments' contains an invalid input parameter"
        );
      });
  });
  it("404 - should respond with a 404 if review is not in the db", () => {
    const commentToAdd = {
      username: "dav3rid",
      body: "great review!",
    };

    return request(app)
      .post("/api/reviews/999999/comments")
      .send(commentToAdd)
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("review not found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("200 - should respond with the correct status code and modified review", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then((res) => {
        const {
          review: [review],
        } = res.body;

        expect(review).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 3,
          category: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 15,
          designer: expect.any(String),
        });
      });
  });
  it("404 - should respond with 404 if review is not in the db", () => {
    return request(app)
      .patch("/api/reviews/999999")
      .send({
        inc_votes: 10,
      })
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("review not found");
      });
  });
  it("400 - should respond with 400 when inputting invalid review_id", () => {
    return request(app)
      .patch("/api/reviews/toast")
      .send({
        inc_votes: 10,
      })
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "'/api/reviews/toast' contains an invalid input parameter"
        );
      });
  });
  it("422 - should respond with the correct status code if the field being changed doesn't exist or is restricted", () => {
    return request(app)
      .patch("/api/reviews/toast")
      .send({
        title: "new title",
      })
      .expect(422)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("Only the votes field may be updated at this time");
      });
  });
  it("400 - should respond with correct status code if the value of votes is not a number", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({
        inc_votes: "ten",
      })
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "Invalid input type for votes, input must be a number"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204 - should respond with correct status code and no content", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  it("404 - should respond with 404 after the comment has been deleted", () => {
    return request(app)
      .delete("/api/comments/3")
      .then(() => {
        return request(app).delete("/api/reviews/3").expect(404);
      });
  });
  it("404 - should respond with 404 if comment is not in the db", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe("review not found");
      });
  });
  it("400 - should respond with correct status code when inputting incorrect comment id", () => {
    return request(app)
      .delete("/api/comments/toast")
      .expect(400)
      .then((res) => {
        const { error } = res.body;

        expect(error).toBe(
          "'/api/comments/toast' contains an invalid input parameter"
        );
      });
  });
});
