
let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
module.exports = (req,res)=>{
    Model.User.findOne({ username: req.username }).then((user) => {
        if (!user) {
          response = errorResponse(404,{exists: false}, "Account does not exists. Do you want to create one?")
          res.status(response.status).send(response)
        } else {
          bcrypt.compare(req.password, user.password).then((isMatch) => {
            if (isMatch) {
                let payload = {subject: user._id}
                let token = jwt.sign(payload,'secretKey')
                response = successResponse(200,{token},"Password matched")
                res.status(response.status).send(response);
            } else {
              response = errorResponse(401,{exists: true}, "Incorrect password!")
              res.status(response.status).send(response)
            }
          });
        }
      }).catch((err) => {
        response = errorResponse(503, err, "Service Unavailable!");
        res.status(response.status).send(response);
      });
}