let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.Establishment.findById(req.params.id, (err, establishment) => {
    if (err) {
      response = errorResponse(500, err, "Service unavailable!");
      return res.status(response.status).send(response);
    }
    if (establishment) {
      response = successResponse(
        200,
        establishment,
        "Establishment retrieved successfully!"
      );
      res.status(response.status).send(response);
    } else {
      response = errorResponse(404, err, "Establishment not found!");
      res.status(response.status).send(response);
    }
  }).catch((err) => {
    response = errorResponse(500, err, "Service unavailable!");
    res.status(response.status).send(response);
  });
};
