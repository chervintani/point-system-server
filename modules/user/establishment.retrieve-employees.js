let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let result = await Model.Establishment.findById(req.params.id, {
      employees: 1,
      _id: 0,
    })
      .populate("employees", { firstname: 1, lastname: 1, phone_number: 1 })
      .exec();
    response = successResponse(200, result.employees, "Retrieved employees successfully");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(404, error, "Not found!");
    res.status(response.status).send(response);
  }
};
