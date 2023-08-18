const db = require("../db/connection");

function selectAllUsers() {
  return db
    .query(`SELECT username, name, avatar_url FROM users`)
    .then((result) => {
      return result.rows;
    });
}

module.exports = {
  selectAllUsers,
};
