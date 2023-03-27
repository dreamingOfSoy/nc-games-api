const db = require("../db/connection");

class Category {
  find = () => {
    const queryString = `
    SELECT * FROM categories;
    `;

    return db.query(queryString).then((res) => res.rows);
  };
}

module.exports = new Category();
