let Model = require("../../models/user");

module.exports = async(req, res) => {
try {
    let user = await Model.Establishment.findOne({_id:req.params.id});
    res.status(200).send(user)
  } catch (error) {
    res.status(500).json(error)
  }
}