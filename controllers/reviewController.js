const {
  findOneReview,
  findAllReviews,
  findAllComments,
  addOneComment,
  updateOneReview,
} = require("../models/reviewModel");

exports.getOneReview = (req, res, next) => {
  const { review_id: id } = req.params;

  const review = findOneReview(id);

  review.then((data) => res.status(200).send({ review: data })).catch(next);
};

exports.getAllReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  const reviews = findAllReviews(category, sort_by, order);

  reviews
    .then((data) => {
      {
        if (category && data.length === 0) {
          return Promise.reject({
            error: `No category with the name ${category}`,
            status: 404,
          });
        }

        res.status(200).send({ reviews: data });
      }
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  const { review_id: id } = req.params;

  Promise.all([findAllComments(id), findOneReview(id)])
    .then(([comments, review]) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postOneComment = (req, res, next) => {
  const { review_id: id } = req.params;
  const { body } = req;

  Promise.all([findOneReview(id), addOneComment(id, body)])
    .then(([review, comment]) => res.status(201).send({ comment }))
    .catch(next);
};

exports.patchOneReview = (req, res, next) => {
  const { review_id: id } = req.params;
  const { body } = req;

  Promise.all([findOneReview(id), updateOneReview(id, body)])
    .then(([review, updatedReview]) =>
      res.status(200).send({ review: updatedReview })
    )
    .catch(next);
};
