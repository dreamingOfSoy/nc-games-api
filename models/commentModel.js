const db = require("../db/connection");

exports.removeOneComment = (id) => {
  const queryString = `
  DELETE FROM comments
  WHERE comment_id = $1
`;

  return db.query(queryString, [id]).then((res) => res.rows);
};
