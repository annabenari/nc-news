const db = require("../db/connection");

function selectTopicsFromDatabase() {
  return db
    .query(
      `
      SELECT *
      FROM topics;`
    )
    .then((result) => {
      return result.rows;
    });
}

module.exports = {
  selectTopicsFromDatabase,
};
