const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let admin = require("../../models/admin");
let response = null;
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");

module.exports = (req, res) => {
  admin.findOne({ username: req.body.username }, (error, admin) => {
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
              response = successResponse(200,{token: token},"Password matched")
              console.log(response)
              res.status(response.status).send(response);
          } else {
            response = errorResponse(401,{exists: true}, "Incorrect password!")
            res.status(response.status).send(response)
          }
        })
      }
      
      
        // } else if (username.password !== req.password) {
      //   response = errorResponse(401, null, "Invalid Password");
      //   res.status(response.status).send(response);
      // } else {
      //   let payload = { subject: username._id };
      //   let token = jwt.sign(payload, "secretkey");

      //   response = successResponse(200, token);
      //   res.status(response.status).send(response);
      // }
    }

    // var jwt = nJwt.create({ id: username.id }, config.secret);
    // jwt.setExpiration(new Date().getTime() + (24*60*60*1000));

    // res.status(200).send({ auth: true, token: jwt.compact() });
  });
};
