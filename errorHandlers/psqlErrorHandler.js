exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({
      error: `'${req.originalUrl}' contains an invalid input parameter`,
    });
};
