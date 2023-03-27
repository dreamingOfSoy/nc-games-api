const Category = require("../models/categoryModel");

exports.getAllCategories = (req, res) => {
  const categories = Category.find();

  categories.then((data) => res.status(200).send({ data }));
};
