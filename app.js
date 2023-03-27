const { getAllCategories } = require("./controllers/categoryController");
const { errorHandler } = require("./middleware/errorMiddleware");

const express = require("express");

const app = express();

app.get("/api/categories", getAllCategories);

app.all("*", (req, res, next) => {
  next({
    error: `${req.originalUrl} is not available on this server`,
    status: 404,
  });
});

app.use(errorHandler);

module.exports = app;
