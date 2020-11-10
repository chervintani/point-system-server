let Model = require("../../models/user");

module.exports = async (req, res) => {


  try {
    let updateStatus = await Model.Establishment.findOneAndUpdate(
      { _id: req.body.id },
      { status: req.body.status }
    );
    if (req.body.status == "Accepted") {
      let establishment = await Model.Establishment.findById(req.body.id);
      let post = new Model.Post({
        establishment_id: req.body.id,
        type: 'store',
        title: "New store is open!",
        description: `A new store ${establishment.name} just joined the application. Visit the store now and view their exciting offers and promos!`,
        image: establishment.logo,
        likes: []
      });
      await post.save();
    }
    return res.status(200).json(updateStatus.status);
  } catch (error) {
    res.status(500).json(error);
  }
};
