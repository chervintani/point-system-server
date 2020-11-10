let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity");

module.exports = async (req, res) => {
  try {
    console.log(req.body);
    let result = await Model.User.findById(req.body.user_id);
    let points;
    result.subscribed_stores.find((store) => {
      if (store.establishment == req.body.establishment_id) {
        store.points = store.points + parseInt(req.body.points);
        points = store.points + parseInt(req.body.points);
      }
    });
    //process points to user and record for statistics
    let establishment = await Model.Establishment.findById(
      req.body.establishment_id
    );
    let today = new Date().toString();
    today = today.substring(0, 15);
    let existDate = establishment.daily_scanners.find(
      (scanner) => scanner.date == today
    );
    if(existDate){
      let employee = existDate.employee.find(currentEmployee => currentEmployee.user_id==req.body.employee_id);
      console.log("stoore: ", employee);
      employee.processed.price+= parseInt(req.body.price)
      employee.processed.points+= parseInt(req.body.points)
    }
    await establishment.save();

    let location = establishment.details.location;
    let activity = feedsActivity(
      "Earned point/s",
      `${result.firstname} just gained ${points} points in his/her account`,
      `${location.street}, ${location.barangay}, ${location.city_town} ${location.province_state}`,
      new Date()
    );
    result.feeds_activity.push(activity);
    let data = await result.save();
    response = successResponse(
      200,
      data,
      "Successfully added points to customer"
    );
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
