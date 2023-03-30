exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({
      error: `'${req.originalUrl}' contains an invalid input parameter`,
    });

  if (err.code === "23503")
    res.status(404).send({
      error: `${req.body.username} does not exist`,
    });
};
