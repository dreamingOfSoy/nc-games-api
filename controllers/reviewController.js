const { findOneReview } = require("../models/reviewModel");

exports.getOneReview = (req, res, next) => {
  const { review_id: id } = req.params;

  const review = findOneReview(id);

  review
    .then((data) => {
      if (data.length === 0) {
        return Promise.reject({ error: "review not found", status: 404 });
      }

      res.status(200).send({ review: data });
    })
    .catch(next);
};
