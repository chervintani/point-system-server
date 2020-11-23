const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let Model = require("../../models/admin");
let response = null;
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");

module.exports = (req, res) => {
  Model.Admin.findById(req.body.id, (error, admin) => {
    if (error) {
      response = errorResponse(503, error, "Service Unavailable");
      res.status(response.status).send(response);
    } else {
      if (!admin) {
        response = errorResponse(401, null, "Username does not exists");
        res.status(response.status).send(response);
      } else {
        bcrypt
          .compare(req.body.oldpassword, admin.password)
          .then(async (isMatch) => {
            if (isMatch) {
              console.log("login!!! ");
              (admin.username = req.body.username),
                (admin.password = req.body.newpassword);
              await admin.save();
              response = successResponse(
                200,
                { success: true },
                "Updated superadmin successfully"
              );
              res.status(response.status).send(response);
            } else {
              response = errorResponse(
                401,
                { exists: true },
                "Incorrect password!"
              );
              res.status(response.status).send(response);
            }
          });
      }
    }
  });
};
