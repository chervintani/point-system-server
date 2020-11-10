let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
const bcrypt = require("bcryptjs");

module.exports = (req, res) => {
  Model.User.findById(req.body._id, (err, user) => {
    try {
      if (err) throw err;
      bcrypt.compare(req.body.old_password, user.password).then(async (isMatch) => {
        if (isMatch) {
            user.password = req.body.new_password;
            await user.save();
            response = successResponse(200,{success: true},"Password matched")
            res.status(response.status).send(response);
        } else {
          response = errorResponse(401,{success: false}, "Old password is incorrect!")
          res.status(response.status).send(response)
        }
      });

    } catch (error) {
      response = errorResponse(500, { success: false }, "Service unavailable");
      res.status(response.status).send(response)
    }
  });
};
