const db = require("../db/connection");

exports.findOneReview = (id) => {
  const query = `
  SELECT * FROM reviews
  WHERE review_id = $1
  `;

  return db.query(query, [id]).then((res) => res.rows);
};
