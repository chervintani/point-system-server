let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  Model.Establishment.findOne({
    _id: req.body.establishment_id,
  })
    .populate({
      path: "employees",
      match: {
        _id: req.body.user_id,
      },
    })
    .exec(async (err, establishment) => {
      let today = new Date();
      today = today.toString().substring(0, 15);
      let index = establishment.daily_scanners.findIndex((element) => {
        //index of the current date
        return element.date === today;
      });
      establishment.daily_scanners[index].employee.find((element) => {
        if (element.user_id == req.body.user_id) {
          element.time_out = new Date();
        }
      });
      try {
        await establishment.save();
        response = successResponse(
          200,
          { success: true },
          "You have been logged out in the establishment today."
        );
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(
          500,
          { success: false },
          "Service unavailable"
        );
        res.status(response.status).send(response);
      }
    });
};
