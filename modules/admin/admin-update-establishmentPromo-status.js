let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
module.exports = async(req, res) => {
try {
    let updateEstablishmentPromoStatus = await Model.Promo.findById(req.body.id);
    updateEstablishmentPromoStatus.status = req.body.status
    await updateEstablishmentPromoStatus.save();
    if (req.body.status == "Accepted") {
      console.log("this is accepted");
      let promo = await Model.Promo.findById(req.body.id);
      let establishment = await Model.Establishment.findById(req.body.establishment_id);

      let post = new Model.Post({
        establishment_id: req.body.establishment_id,
        type: 'promo',
        title: "New promo!",
        description: `${establishment.name} just added a new promo. Go to the store and see their new promo added!`,
        image: promo.image,
        likes: []
      });

      await post.save();
    }else{
      await Model.Post.deleteMany({image: promo.image})
       
    }

    response = successResponse(200,{success:true},"Updated promo successfully")
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json(error);
  }
}