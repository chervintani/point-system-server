let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
module.exports = async(req, res) => {
try {
    let updateEstablishmentPromoStatus = await Model.Promo.findById(req.body.id);
    console.log(updateEstablishmentPromoStatus);
    updateEstablishmentPromoStatus.status = req.body.status
    await updateEstablishmentPromoStatus.save();

    if (req.params.status == "Accepted") {
      let promo = await Model.Promo.findById(req.body.id);
      let post = new Model.Post({
        title: "New promo!",
        description: `${promo.name} just added a new promo. Go to the store and see their new promo added!`,
        image: promo.image,
      });
      await post.save();
    }

    response = successResponse(200,{success:true},"Updated promo successfully")
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json(error);
  }
}