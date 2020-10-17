let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity");
module.exports = (req, res) => {
  console.log(req.body.data);
  const establishment = new Model.Establishment(req.body.data);
  establishment.save((err, result) => {
    if (err) {
      response = errorResponse(500, err, "Unable to save!");
      return res.status(response.status).send(response);
    }
    result.qr_code.establishment_id = result._id;
    result.qr_code.name = req.body.data.name;
    result.save((err) => {
      if (err) {
        response = errorResponse(500, err, "Unable to save!");
        return res.status(response.status).send(response);
      }

      Model.User.findOne({ _id: req.body.data.user_id }, (error, success) => {
        if (error) {
          response = errorResponse(500, err, "Unable to update!");
          return res.status(response.status).send(response);
        } else {
          let activity = feedsActivity(
            "Add establishment",
            `${success.firstname} added a new establishment!`,
            req.body.data.location,
            new Date()
          );

          success.feeds_activity.push(activity);
          success.establishments.push(establishment);
          success.save((err, result) => {
            if (err) {
              response = errorResponse(500, err, "Unable to save!");
              return res.status(response.status).send(response);
            } else {
              response = successResponse(
                200,
                result,
                "Establishment saved successfully!"
              );
              res.status(response.status).send(response);
            }
          });
        }
      }).catch((err) => {
        response = errorResponse(503, err, "Service Unavailable!");
        res.status(response.status).send(response);
      });
    });
  });
};
