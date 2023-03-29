const { findAllCategories } = require("../models/categoryModel");

exports.getAllCategories = (req, res) => {
  const categories = findAllCategories();

  categories.then((data) => res.status(200).send({ categories: data }));
};
