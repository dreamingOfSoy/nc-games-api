const db = require("../db/connection");
const format = require("pg-format");

exports.findOneReview = (id) => {
  const query = `
  SELECT reviews.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id
  `;

  return db.query(query, [id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ error: "review not found", status: 404 });
    }

    return res.rows;
  });
};

exports.findAllReviews = (category, sort_by, order = "desc") => {
  return db.query("SELECT slug FROM categories").then((res) => {
    const categories = res.rows.map((row) => row.slug.replace("'", ""));

    if (order !== "asc" && order !== "desc") {
      return Promise.reject({
        error: "Order query can only be asc or desc",
        status: 400,
      });
    }

    let queryString = `
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
    ORDER BY created_at ${order.toUpperCase()}
  `;

    if (category) {
      category = category.replace("-", " ");
      if (!categories.includes(category)) {
        return Promise.reject({
          error: `No category with the name ${category}`,
          status: 404,
        });
      }

      queryString = queryString.replace(
        "GROUP BY reviews.review_id",
        format("WHERE reviews.category = %L GROUP BY reviews.review_id", [
          category,
        ])
      );
    }

    if (sort_by) {
      queryString = queryString.replace(
        "ORDER BY created_at",
        format("ORDER BY reviews.%s", [sort_by])
      );
    }

    return db.query(queryString).then((res) => res.rows);
  });
};

exports.findAllComments = (id) => {
  const queryString = `
  SELECT 
  comment_id,
  votes,
  created_at,
  author,
  body,
  review_id
  FROM comments
  WHERE review_id = $1;
  `;

  return db.query(queryString, [id]).then((res) => res.rows);
};

exports.addOneComment = (id, comment) => {
  if (comment && (!comment.username || !comment.body)) {
    return Promise.reject({
      error: "A comment must have both a body and a username",
      status: 422,
    });
  }

  const queryString = format(
    `
  INSERT INTO comments
    (votes, created_at, author, body, review_id)
  VALUES
    (%L)
  RETURNING *;
  `,
    [0, new Date(Date.now()), comment.username, comment.body, id]
  );

  return db.query(queryString).then((res) => {
    return res.rows;
  });
};

exports.updateOneReview = (id, body) => {
  const inputIsNotNumber = !/^[0-9]*$/.test(body.inc_votes);

  if (body && !body.inc_votes) {
    return Promise.reject({
      error: "Only the votes field may be updated at this time",
      status: 422,
    });
  }

  if (inputIsNotNumber) {
    return Promise.reject({
      error: "Invalid input type for votes, input must be a number",
      status: 400,
    });
  }

  const queryString = `
    UPDATE reviews
    SET
      votes = votes + $2
    WHERE review_id = $1
    RETURNING *
  `;

  return db.query(queryString, [id, body.inc_votes]).then((res) => res.rows);
};
