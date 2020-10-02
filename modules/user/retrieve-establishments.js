let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.User.findOne({ _id: req.body.id })
    .populate("establishments")
    .exec((err, users) => {
      if (err) return res.send(err);
      if (users) {
        response = successResponse(
          200,
          { establishments: users.establishments },
          "User's establishments retrieved successfully!"
        );
        res.status(response.status).send(response);
      } else {
        response = errorResponse(404, users, "User not found");
        res.status(response.status).send(response);
      }
    });
};
