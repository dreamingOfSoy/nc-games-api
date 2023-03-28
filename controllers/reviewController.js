const { findOneReview } = require("../models/reviewModel");

exports.getOneReview = (req, res, next) => {
  const { review_id: id } = req.params;

  const review = findOneReview(id);

  review.then((data) => res.status(200).send({ data }));
};
