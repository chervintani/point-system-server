let Model = require("../../models/user");

module.exports = async(req, res) => {
Model.User.countDocuments({}).exec((err, count) => {
    if (err) {
      res.send(err);
      return;
    }
    res.json(count);
  });
}