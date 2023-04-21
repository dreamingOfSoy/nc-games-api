exports.clientErrorHandler = (err, req, res, next) => {
  console.log(err);
  if (
    err.status === 400 &&
    err.error === "Invalid input type for votes, input must be a number"
  ) {
    res.status(400).send(err);
  }

  if (
    err.status === 400 &&
    err.error === "Order query can only be asc or desc"
  ) {
    res.status(400).send(err);
  }

  if (
    err.status === 400 &&
    err.error === `${originalUrl} is not available on this server`
  ) {
    res.status(400).send(err);
  }

  if (err.status === 404 && err.error === "review not found") {
    res.status(404).send(err);
  }

  if (
    err.status === 404 &&
    err.error ===
      `No category with the name ${req.query.category?.replaceAll("-", " ")}`
  ) {
    res.status(404).send(err);
  }

  if (err.status === 422) {
    res.status(422).send(err);
  }

  next(err);
};
