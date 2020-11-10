let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let result = [];
    let finalArr = [];
    let user = await Model.User.find({}, { subscribed_stores: 1 });
    user.forEach((element) => {
      element.subscribed_stores.forEach((stores) => {
        if (stores.establishment == req.params.id) {
          stores._id = element._id;
          result.push(stores);
        }
      });
    });
    for (let index = 0; index < result.length; index++) {
      let user = await Model.User.findById(result[index]._id, {
        firstname: 1,
        lastname: 1,
      });
      let data = {
        firstname: user.firstname,
        lastname: user.lastname,
        points: result[index].points,
        date_subscribed: result[index].date_subscribed,
      };
      finalArr.push(data);
    }
    finalArr.sort((a, b) => parseInt(b.points) - parseInt(a.points));
    response = successResponse(200, finalArr, "Retrieve top earners");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
