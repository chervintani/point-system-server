let Model = require("../../models/user");

module.exports = async (req, res) => {
  const promosResult = await Model.Establishment.findById(req.params.id, {
    promos: true,
  })
    .populate("promos")
    .exec();
  res.send(promosResult);
};
