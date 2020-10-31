let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity");

module.exports = async (req, res) => {
  try {
    let result = await Model.User.findById(req.body.user_id);
    let points;
    result.subscribed_stores.find((store) => {
      if (store.establishment == req.body.establishment_id) {
        store.points = store.points + req.body.points;
        points = store.points + req.body.points;
      }
    });
    let establishment = await Model.Establishment.findById(req.body.establishment_id)
    let location = establishment.details.location
    let activity = feedsActivity(
      "Obtained point/s",
      `${result.firstname} just gained ${points} points in his/her account`,
      `${location.street}, ${location.barangay}, ${location.city_town} ${location.province_state}`,
      new Date()
    );
    result.feeds_activity.push(activity);
    let data = await result.save();
    response = successResponse(200, data, "Retrieved customer successfully");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
