const { updateArticleVote } = require("../models/voteCount.model");

exports.patchArticleVote = (req, res, next) => {
  const article_id = req.params.article_id;

  const inc_votes = req.body.inc_votes;

  updateArticleVote(article_id, inc_votes)
    .then((updatedArticlevote) => {
      res.status(200).send({ article: updatedArticlevote });
    })
    .catch((error) => {
      next(error);
    });
};
