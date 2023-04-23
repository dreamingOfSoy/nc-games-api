const { removeOneComment } = require("../models/commentModel");

exports.deleteOneComment = (req, res, next) => {
  const { comment_id: id } = req.params;

  removeOneComment(id)
    .then((response) => res.status(204).send())
    .catch(next);
};
