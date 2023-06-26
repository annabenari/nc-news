const db = require("../db/connection");

function selectTopicsFromDatabase() {
  return db
    .query(
      `
      SELECT *
      FROM topics;`
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    });
}

module.exports = {
  selectTopicsFromDatabase,
};
