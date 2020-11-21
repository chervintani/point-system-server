let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
module.exports = async(req, res) => {
try {
    let updateEstablishmentOfferStatus = await Model.Offer.findById(req.body.id);
    console.log(updateEstablishmentOfferStatus);
    updateEstablishmentOfferStatus.status = req.body.status
    await updateEstablishmentOfferStatus.save();

    if (req.body.status == "Accepted") {
      let offer = await Model.Offer.findById(req.body.id);
      let establishment = await Model.Establishment.findById(req.body.establishment_id);
      let post = new Model.Post({
        establishment_id: req.body.establishment_id,
        type: 'offer',
        title: "New offer!",
        description: `${establishment.name} has a new offer just for you. Visit the store now and view offers that you might like and avail to gain points!`,
        image: offer.image,
        likes: []
      });
      await post.save();
    }else{
      await Model.Post.deleteMany({image: req.body.image})
       
    }

    response = successResponse(200,{success:true},"Updated offer successfully")
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json(error);
  }
}