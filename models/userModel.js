const db = require("../db/connection");

exports.findAllUsers = () => {
  const queryString = `
   SELECT * FROM users; 
  `;

  return db.query(queryString).then((res) => res.rows);
};
