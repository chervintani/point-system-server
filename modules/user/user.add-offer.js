let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
let feedsActivity = require("../../helpers/feeds-activity")

module.exports = (req, res) => {
    Model.Establishment.findOne(
        { _id: req.body.establishment_id, user_id: req.body.user_id },
        (err, establishment) => {
          if (err) throw err;
          console.log(establishment);
    
          var offerObj = {
            establishment_id: req.body.establishment_id,
            name: req.body.name,
            description: req.body.description,
            points: req.body.points,
            price: req.body.price,
            image: req.body.image,
          };
          const offer = new Model.Offer(offerObj);
          offer.save((err, result) => {
            if (err) {
              response = errorResponse(500, err, "Unable to add offer!");
              return res.status(response.status).send(response);
            }
    
            Model.User.findById(req.body.user_id, (err, user) => {
              if (err) {
                response = errorResponse(500, err, "Unable to add offer!");
                return res.status(response.status).send(response);
              }
              console.log(user);
              let activity = feedsActivity(
                "Added offer",
                `${user.firstname} added a offer on an establishment ${establishment.name}`,
                req.body.location,
                new Date()
              );
              user.feeds_activity.push(activity);
              user.save((err, result) => {
                if (err) {
                  response = errorResponse(500, err, "Unable to add offer!");
                  return res.status(response.status).send(response);
                }
              });
    
              establishment.offers.push(offer);
              establishment.save((err, result) => {
                if (err) {
                  response = errorResponse(500, err, "Unable to add offer!");
                  return res.status(response.status).send(response);
                } else {
                  response = successResponse(
                    200,
                    result,
                    "offer added successfully!"
                  );
                  res.status(response.status).send(response);
                }
              });
            });
          });
        }
      ).catch((error) => {
        response = errorResponse(500, error, "Service unavailable!");
        return res.status(response.status).send(response);
      });
}