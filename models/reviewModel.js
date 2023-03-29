const db = require("../db/connection");

exports.findOneReview = (id) => {
  const query = `
  SELECT * FROM reviews
  WHERE review_id = $1
  `;

  return db.query(query, [id]).then((res) => res.rows);
};

exports.findAllReviews = () => {
  const queryString = `
  SELECT 
  reviews.owner,
  reviews.title,
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  reviews.votes,
  reviews.designer, 
  CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;
  `;

  return db.query(queryString).then((res) => res.rows);
};
