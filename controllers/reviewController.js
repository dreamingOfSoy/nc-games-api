const {
  findOneReview,
  findAllReviews,
  findAllComments,
} = require("../models/reviewModel");

exports.getOneReview = (req, res, next) => {
  const { review_id: id } = req.params;

  const review = findOneReview(id);

  review.then((data) => res.status(200).send({ review: data })).catch(next);
};

exports.getAllReviews = (req, res, next) => {
  const reviews = findAllReviews();

  reviews.then((data) => {
    res.status(200).send({ reviews: data });
  });
};

exports.getAllComments = (req, res, next) => {
  const { review_id: id } = req.params;

  Promise.all([findAllComments(id), findOneReview(id)])
    .then(([comments, review]) => res.status(200).send({ comments }))
    .catch(next);
};
