let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let user = await Model.User.findOne({
      phone_number: req.body.phone_number,
    });
    user.password = req.body.new_password;
    await user.save();

    response = successResponse(200, { success: true }, "Password matched");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, { success: false }, "Service unavailable");
    res.status(response.status).send(response);
  }
};
