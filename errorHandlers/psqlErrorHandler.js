exports.psqlErrorHandler = (err, req, res, next) => {
  console.log(req);
  if (err.code === "22P02")
    res.status(400).send({
      error: `'${req.originalUrl}' constains an invalid input parameter`,
    });
};
