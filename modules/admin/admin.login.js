const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let Model = require("../../models/admin");
let response = null;
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");

module.exports = (req, res) => {
 Model.Admin.findOne({ username: req.body.username }, (error, admin) => {
    if (error) {
      response = errorResponse(503, error, "Service Unavailable");
      res.status(response.status).send(response);
    } else {
      if (!admin) {
        response = errorResponse(401, null, "Username does not exists");
        res.status(response.status).send(response);
      }else{
        bcrypt.compare(req.body.password, admin.password).then((isMatch) => {
          if (isMatch) {
              let payload = {subject: admin._id}
              let token = jwt.sign(payload,'secretKey')
              response = successResponse(200,{token: token,username:req.body.username},"Password matched")
              console.log(response)
              res.status(response.status).send(response);
          } else {
            response = errorResponse(200,{error: true}, "Incorrect password!")
            res.status(response.status).send(response)
          }
        })
      }
    }
  });
};
