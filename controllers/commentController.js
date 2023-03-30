const { removeOneComment } = require("../models/commentModel");
const { findOneReview } = require("../models/reviewModel");

exports.deleteOneComment = (req, res, next) => {
  const { comment_id: id } = req.params;

  Promise.all([findOneReview(id), removeOneComment(id)])
    .then(([review, response]) => res.status(204).send())
    .catch(next);
};
