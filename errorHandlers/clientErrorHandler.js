exports.clientErrorHandler = (err, req, res, next) => {
  if (
    err.status === 400 &&
    err.error === `${originalUrl} is not available on this server`
  )
    res.status(400).send(err);

  if (err.status === 404 && err.error === "review not found")
    res.status(404).send(err);

  if (
    err.status === 422 &&
    err.error === "A comment must have both a body and a username"
  )
    res.status(422).send(err);

  next(err);
};
