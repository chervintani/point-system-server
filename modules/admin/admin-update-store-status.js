let Model = require("../../models/user");

module.exports = async (req, res) => {
  console.log(req.body.status)
  console.log(req.params.id)

  try {
    let updateStatus = await Model.Establishment.findOneAndUpdate(
      { _id: req.params.id },
      { status: req.params.status }
    );
    return res.send(updateStatus.status);
  } catch (error) {
    res.status(500).json(error);
  }
};