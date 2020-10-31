let Model = require("../../models/user");

module.exports = async(req, res) => {
const result = await Model.User.findOne(
    { _id: req.params.id },
    "subscribed_stores",
    function (err, subscribed_stores) {
      if (err) return res.send(err);
    }
  );
  res.status(200).send(result.subscribed_stores.length.toString());
}