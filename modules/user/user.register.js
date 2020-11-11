let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
const jwt = require("jsonwebtoken");
const feedsActivity = require("../../helpers/feeds-activity")
module.exports = (req, res) => {
  Model.User.find(
    { username: req.username },
    { password: 0 },
    (err, account) => {
      if (err) {
        response = errorResponse(400, err, "Bad Request!");
        res.status(response.status).send(response);
      } else if (account.length) {
        response = errorResponse(409, { exist: true },"Username is already taken, try another one!"
        );
        res.status(response.status).send(response);
      } else {
        var newUser = new Model.User({
          firstname: req.firstname,
          lastname: req.lastname,
          birthdate: req.birthdate,
          phone_number: req.phone,
          username: req.username,
          password: req.password,
          establishments: [],
          qr_code: {},
          employee: { status: false, establishment_id: null },
          subscribed_stores: [],
          rewards: [],
        });

        newUser.save((err) => {
          if (err) throw err;
          console.log("User created!");

          Model.User.findOne(
            { username: req.username },
            { password: 0 },
            (err, user) => {
              user.qr_code = { user_id: user._id, username: req.username };
              // save the user
              let activity = feedsActivity(
                "Joined Premyo",
                `${user.firstname} joined the app!`,
                req.location,
                new Date()
              );
              user.feeds_activity.push(activity);
              user.save(function (err, data) {
                if (err) throw err;
                console.log(data);
                let payload = { subject: data._id };
                let token = jwt.sign(payload, "secretKey");

                response = successResponse(
                  200,
                  { token: token, data},
                  "Registered Successfully"
                );
                res.status(response.status).send(response);
              });
            }
          ).catch((err) => {
            response = errorResponse(503, err, "Service Unavailable!");
            res.status(response.status).send(response);
          });
        });
      }
    }
  ).catch((err) => {
    response = errorResponse(503, err, "Service Unavailable!");
    res.status(response.status).send(response);
  });
};
