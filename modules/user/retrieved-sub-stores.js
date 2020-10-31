let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  // Model.Establishment.find(
  //   { user_id: req.params.id },
  //   { _id: 1, offers: 1, promos: 1, name: 1, logo: 1, details: 1, description: 1, website: 1 },
  //   (err, establishment) => {
  //     if (err) {
  //       response = errorResponse(500, err, "Service unavailable!");
  //       return res.status(response.status).send(response);
  //     }
  //     response = successResponse(
  //       200,
  //       establishment,
  //       "Subscribed stores retrieved successfully!"
  //     );
  //     res.status(response.status).send(response);
  //   }
  // ).catch((err) => {
  //   response = errorResponse(500, err, "Service unavailable!");
  //   res.status(response.status).send(response);
  // });
  Model.User.findById(req.params.id)
    .populate("subscribed_stores.establishment")
    .exec((err, user) => {
      try {
        if (err) throw err;
        if (user) {
          console.log(user.subscribed_stores);
          response = successResponse(
            200,
            user.subscribed_stores,
            "Subscribed stores retrieved successfully!"
          );
          res.status(response.status).send(response);
        } else {
          response = errorResponse(404, users, "User not found");
          res.status(response.status).send(response);
        }
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable");
        res.status(response.status).send(response);
      }
    });
};
