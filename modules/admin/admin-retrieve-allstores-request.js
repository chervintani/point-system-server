let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.Establishment.find(
    {},
    {},
    {sort: {_id:-1}},
    (err, stores) => {
      if (err) {
        response = errorResponse(500, err, "Service unavailable!");
        return res.status(response.status).send(response);
      }
      response = successResponse(200, stores, "Stores retrieved successfully!");
      res.status(response.status).send(response);
    }
  ).catch((err) => {
    response = errorResponse(500, err, "Service unavailable!");
    res.status(response.status).send(response);
  });
};
