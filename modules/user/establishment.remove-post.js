let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    switch (req.body.type) {
      case "promo":
        let promo = await Model.Promo.findById(req.body.post_id);
        await Model.Post.deleteMany({image: promo.image})
        await Model.Promo.findByIdAndDelete(req.body.post_id);
        break;
      case "offer":
        let offer = await Model.Offer.findById(req.body.post_id);
        await Model.Post.deleteMany({image: offer.image})
        await Model.Offer.findByIdAndDelete(req.body.post_id);
        break;
    }
    // await Model.Post.deleteMany({ image: req.body.image });
    response = successResponse(200, { success: true }, "Deleted successfully");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, { success: false }, "Service unavailable");
    res.status(response.status).send(response);
  }
};
