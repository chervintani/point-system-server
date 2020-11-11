let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
  Model.User.findById(req.body._id, async (err, user) => {
    try {
      if (err) throw err;

      let phone_number = await Model.User.find({
        phone_number: req.body.phone_number,
        _id: { $ne: req.body._id },
      });
      console.log(phone_number);
      if (!phone_number.length) {
        let username = await Model.User.find({
          username: req.body.username,
          _id: { $ne: req.body._id },
        });
      console.log(username);

        if (username.length) {
          response = errorResponse(
            200,
            { success: false },
            "Username already exists, try another one!"
          );
          res.status(response.status).send(response);
        } else {
          user.firstname = req.body.firstname;
          user.lastname = req.body.lastname;
          user.phone_number = req.body.phone_number;
          user.username = req.body.username;
          user.profile_picture = req.body.profile_picture;
          user.save((err, data) => {
            try {
              if (err) throw err;
              response = successResponse(200, data, "Updated successfully");
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
        }
      } else {
        response = errorResponse(
          200,
          { success: false },
          "Phone number already exists"
        );
        res.status(response.status).send(response);
      }
    } catch (error) {
      response = errorResponse(404, { exists: false }, "User does not exist");
      res.status(response.status).send(response);
    }
  });
};
