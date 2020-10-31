let Model = require("../../models/user");

module.exports = async(req, res) => {
const result = await Model.User.find({_id:req.params.id},{subscribed_stores:true})
.populate({
  path: "subscribed_stores.establishment",
  model: "Establishment",
  select: ["name"]
})
.exec();
res.send(result);
}