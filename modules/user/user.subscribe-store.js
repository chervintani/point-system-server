let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity");

module.exports = (req, res) => {
  Model.User.findById(req.params.user_id, { password: 0 }, (err, user) => {
    if (err) {
      response = errorResponse(500, err, "Cannot find user!");
      return res.status(response.status).send(response);
    }
    Model.Establishment.findById(req.params.store_id, async (err, establishment) => {
      if (err) {
        response = errorResponse(500, err, "Unable find establishment!");
        return res.status(response.status).send(response);
      }
      establishment.subscribers.push(user)
      await establishment.save();
      const establishmentModel = new Model.Establishment(establishment);
      establishmentModel._id = req.params.store_id
      let activity = feedsActivity(
        "Subscribed a store",
        `${user.firstname} subscribed ${establishment.name}.`,
        req.params.location,
        new Date()
      );
      user.feeds_activity.push(activity);
      user.subscribed_stores.push({
        establishment: establishmentModel,
        points: 0,
        date_subscribed: new Date(),
        rewards: []
      });

      user.save((err, data) => {
        if (err) {
          response = errorResponse(500, err, "Unable to subscribe store!");
          return res.status(response.status).send(response);
        }
        response = successResponse(200, establishment, "Store subscribed successfully!");
        res.status(response.status).send(response);
      });
    }).catch((error) => {
      response = errorResponse(500, error, "Service unavailable!");
      return res.status(response.status).send(response);
    });
  }).catch((error) => {
    response = errorResponse(500, error, "Service unavailable!");
    return res.status(response.status).send(response);
  });
};
