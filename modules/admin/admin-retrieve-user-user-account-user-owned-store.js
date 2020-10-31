let Model = require("../../models/user");

module.exports = async(req, res) => {
const result = await Model.User.find(
    { _id: req.params.id },
    { establishments: true }
  )
    .populate({
      path: "establishments",
      model: "Establishment",
      select: ["name","created_at"],
    })
    .exec();
  res.send(result);
}