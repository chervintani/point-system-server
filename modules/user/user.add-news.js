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
    
          var newsObj = {
            establishment_id: req.body.establishment_id,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
          };
          const news = new Model.News(newsObj);
          news.save((err, result) => {
            if (err) {
              response = errorResponse(500, err, "Unable to add news!");
              return res.status(response.status).send(response);
            }
    
            Model.User.findById(req.body.user_id, (err, user) => {
              if (err) {
                response = errorResponse(500, err, "Unable to add news!");
                return res.status(response.status).send(response);
              }
              console.log(user);
              let activity = feedsActivity(
                "Added news",
                `${user.firstname} added a news on an establishment ${establishment.name}`,
                req.body.location,
                new Date()
              );
              user.feeds_activity.push(activity);
              user.save((err, result) => {
                if (err) {
                  response = errorResponse(500, err, "Unable to add news!");
                  return res.status(response.status).send(response);
                }
              });
    
              establishment.news.push(news);
              establishment.save((err, result) => {
                if (err) {
                  response = errorResponse(500, err, "Unable to add news!");
                  return res.status(response.status).send(response);
                } else {
                  response = successResponse(
                    200,
                    result,
                    "News added successfully!"
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