exports.clientErrorHandler = (err, req, res, next) => {
  if (
    err.status === 400 &&
    err.error === `${originalUrl} is not available on this server`
  )
    res.status(400).send(err);
  if (err.status === 404 && err.error === "review not found")
    res.status(404).send(err);

  next(err);
};
