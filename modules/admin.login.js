const jwt = require("jsonwebtoken");
let admin = require("../models/admin");
let response = null;
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");

module.exports = (req, res) => {
  admin.findOne({ username: req.username }, (error, username) => {
    if (error) {
      response = errorResponse(503, error, "Service Unavailable");
      res.status(response.status).send(response);
    } else {
      if (!username) {
        response = errorResponse(401, null, "Username does not exists");
        res.status(response.status).send(response);
      } else if (username.password !== req.password) {
        response = errorResponse(401, null, "Invalid Password");
        res.status(response.status).send(response);
      } else {
        let payload = { subject: username._id };
        let token = jwt.sign(payload, "secretkey");

        response = successResponse(200, token);
        res.status(response.status).send(response);
      }
    }

    // var jwt = nJwt.create({ id: username.id }, config.secret);
    // jwt.setExpiration(new Date().getTime() + (24*60*60*1000));

    // res.status(200).send({ auth: true, token: jwt.compact() });
  });
};
