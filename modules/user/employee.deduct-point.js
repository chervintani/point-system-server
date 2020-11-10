let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity");

module.exports = async (req, res)=>{
    try {
        let user = await Model.User.findById(req.body.user_id);
        let points;
        user.subscribed_stores.find((store) => {
          if (store.establishment == req.body.establishment_id) {
            store.points = store.points - req.body.points;
            points = store.points - req.body.points;
            store.rewards.push(req.body.promo_id)
          }
        });
        let establishment = await Model.Establishment.findById(req.body.establishment_id)
        let location = establishment.details.location
        let activity = feedsActivity(
          "Consumed point/s",
          `${user.firstname} consumed ${points} points in his/her account and gained reward`,
          `${location.street}, ${location.barangay}, ${location.city_town} ${location.province_state}`,
          new Date()
        );
        user.feeds_activity.push(activity);
        let data = await user.save();
        response = successResponse(200, data, "Successfully process points to customer");
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable!");
        res.status(response.status).send(response);
      }
}