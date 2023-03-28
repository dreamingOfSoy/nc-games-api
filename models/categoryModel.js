const db = require("../db/connection");

exports.findAllCategories = () => {
  const queryString = `
    SELECT * FROM categories;
    `;

  return db.query(queryString).then((res) => res.rows);
};
