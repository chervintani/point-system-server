let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let establishment = await Model.Establishment.findById(req.params.id);
    let result = establishment.daily_scanners.find((scanner) => {
      return scanner.date == req.params.date;
    });
    let employeesAttandance = [];

    for (let index = 0; index < result.employee.length; index++) {
      console.log(result.employee[index].user_id);
      let addEmployee = await Model.User.findById(
        result.employee[index].user_id,
        { firstname: 1, lastname: 1 }
      );
      console.log("employee: ", addEmployee);
      employeesAttandance.push({
        firstname: addEmployee.firstname,
        lastname: addEmployee.lastname,
        time_in: result.employee[index].time_in,
        time_out: result.employee[index].time_out,
      });
    }
    console.log("gawas: ", employeesAttandance);
    response = successResponse(
      200,
      employeesAttandance,
      `Retrieved ${req.params.date} successfully`
    );
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(404, error, "Not found!");
    res.status(response.status).send(response);
  }
};
