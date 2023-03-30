const { getAllCategories } = require("./controllers/categoryController");
const {
  getOneReview,
  getAllReviews,
  getAllComments,
  postOneComment,
} = require("./controllers/reviewController");
const { clientErrorHandler } = require("./errorHandlers/clientErrorHandler");
const { psqlErrorHandler } = require("./errorHandlers/psqlErrorHandler");

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getOneReview);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getAllComments);
app.post("/api/reviews/:review_id/comments", postOneComment);

app.all("*", (req, res, next) => {
  res.status(404).send({
    error: `${req.originalUrl} is not available on this server`,
    status: 404,
  });
});

app.use(clientErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;
