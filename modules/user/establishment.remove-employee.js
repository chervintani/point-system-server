let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let establishment = await Model.Establishment.findById(
      req.params.establishment_id
    )
      .populate("employees")
      .exec();
    if (establishment) {
      establishment.employees.forEach((employee) => {
        if (employee._id == req.params.employee_id) {
          const index = establishment.employees.indexOf(employee);
          if (index > -1) {
            establishment.employees.splice(index, 1);
          }
        }
      });
      await establishment.save();
      response = successResponse(
        200,
        { success: true },
        "Removed employee successfully"
      );
      res.status(response.status).send(response);
    }
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
