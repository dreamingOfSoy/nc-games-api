exports.clientErrorHandler = (err, req, res, next) => {
  if (err.status === 400) res.status(400).send(err);

  next(err);
};
