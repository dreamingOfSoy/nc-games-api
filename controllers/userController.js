const { findAllUsers } = require("../models/userModel");

exports.getAllUsers = (req, res, next) => {
  findAllUsers().then((data) => res.status(200).send({ users: data }));
};
