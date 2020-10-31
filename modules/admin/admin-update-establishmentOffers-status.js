let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
module.exports = async (req, res) => {
try {
    let updateEstablishmentOfferStatus = await Model.Offer.findById(req.body.id);
    console.log(updateEstablishmentOfferStatus);
    updateEstablishmentOfferStatus.status = req.body.status
    await updateEstablishmentOfferStatus.save();

    if (req.params.status == "Accepted") {
      let offer = await Model.Offer.findById(req.body.id);
      let post = new Model.Post({
        title: "New offer!",
        description: `${offer.name} has a new offer just for you. Visit store now and view offers that you might like and you can gain points!`,
        image: offer.image,
      });
      await post.save();
    }

    response = successResponse(200,{success:true},"Updated offer successfully")
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json(error);
  }
}