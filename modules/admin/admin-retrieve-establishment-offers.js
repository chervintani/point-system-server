let Model = require("../../models/user");

module.exports = async (req, res) => {
  const offersResult = await Model.Establishment.findById(req.params.id, {
    offers: true,
  })
    .populate("offers")
    .exec();
  res.send(offersResult);
};
