exports.errorHandler = (err, req, res, next) => {
  if (err.status === 404) return res.status(404).send(err);
};
