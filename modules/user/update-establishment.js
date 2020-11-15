let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.Establishment.findOne(
    { _id: req.body._id },
    async (err, establishment) => {
      if (err) {
        response = errorResponse(404, err, "Document ID not found!");
        return res.status(response.status).send(response);
      } else {
        if (establishment) {
          console.log(establishment);

          let post = await Model.Post.findOne({
            establishment_id: req.body.id,
            type: "store",
          });
          post.title = "A store is updated";
          post.description = `${establishment.name} just updated their store, check out what's new!`;
          post.image = req.body.logo;
          post.date_created = new Date();
          await post.save();

          establishment.name = req.body.name;
          establishment.logo = req.body.logo;
          establishment.website = req.body.website;
          establishment.details = req.body.details;
          establishment.description = req.body.description;
          establishment.qr_code = req.body.qr_code;
          // establishment.status = req.body.status;
          establishment.support_delivery = req.body.support_delivery;

          establishment.save((err, result) => {
            if (err) {
              response = errorResponse(500, err, "Save failed!");
              return res.status(response.status).send(response);
            }
            response = successResponse(200, result, "Updated successfully!");
            return res.status(response.status).send(response);
          });
        } else {
          response = errorResponse(404, err, "Document ID not found.");
          res.status(response.status).send(response);
        }
      }
    }
  ).catch((err) => {
    response = errorResponse(500, err, "Server failed, try again later.");
    res.status(response.status).send(response);
  });
};
