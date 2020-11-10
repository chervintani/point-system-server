let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let establishment = await Model.Establishment.findById(req.body.id);
    if (establishment) {
      establishment.lock_employees = req.body.lock_employees;
      console.log(establishment);
      let result = await establishment.save();
      console.log(result);
      response = successResponse(
        200,
        { success: true },
        "Successfully updated lock employees status"
      );
      res.status(response.status).send(response);
    }
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
