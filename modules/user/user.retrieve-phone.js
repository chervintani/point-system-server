let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let user = await Model.User.findOne({
      phone_number: req.params.phone_number,
    },{firstname: 1});
    response = successResponse(
      200,
      user,
      "Retrieved user successfully"
    );
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
