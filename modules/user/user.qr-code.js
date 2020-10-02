let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.User.findById(req.body.id, { qr_code: 1, _id: 0 })
    .then((user) => {
      response = successResponse(200, user, "This is the QR Code of the user");
      res.status(response.status).send(response);
    })
    .catch((err) => {
      response = errorResponse(503, err, "Service Unavailable!");
      res.status(response.status).send(response);
    });
};
