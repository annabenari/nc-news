//require model
const { selectTopicsFromDatabase } = require("../models/topics.model");

exports.getTopics = (req, res) => {
  selectTopicsFromDatabase().then((topics) => {
    res.status(200).send(topics);
  });
};

// Responds with:

// an array of topic objects, each of which should have the following properties:
// slug
// description
// As this is the first endpoint, you will need to set up your testing suite.

// Consider what errors could occur with this endpoint, and make sure to test for them.
