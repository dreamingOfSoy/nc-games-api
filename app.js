const { getAllCategories } = require("./controllers/categoryController");
const {
  getOneReview,
  getAllReviews,
  getAllComments,
  postOneComment,
  patchOneReview,
} = require("./controllers/reviewController");
const { deleteOneComment } = require("./controllers/commentController");
const { getAllUsers } = require("./controllers/userController");
const { clientErrorHandler } = require("./errorHandlers/clientErrorHandler");
const { psqlErrorHandler } = require("./errorHandlers/psqlErrorHandler");

const endpointsJson = require("./endpoints.json");

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getOneReview);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getAllComments);
app.post("/api/reviews/:review_id/comments", postOneComment);
app.patch("/api/reviews/:review_id", patchOneReview);
app.delete("/api/comments/:comment_id", deleteOneComment);
app.get("/api/users", getAllUsers);
app.get("/api", (req, res, next) => {
  if (!endpointsJson) {
    return next(
      new Error({
        error: `Something went wrong`,
        status: 400,
      })
    );
  }

  res.status(200).send({ endpoints: endpointsJson });
});

app.all("*", (req, res, next) => {
  res.status(404).send({
    error: `${req.originalUrl} is not available on this server`,
    status: 404,
  });
});

app.use(clientErrorHandler);
app.use(psqlErrorHandler);

module.exports = app;
