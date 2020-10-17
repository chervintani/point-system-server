const Nexmo = require("nexmo");
const config = require("../../config.json");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

const nexmo = new Nexmo({
  apiKey: config.nexmo_config.apiKey,
  apiSecret: config.nexmo_config.apiSecret,
});

makeRequest = (req, res) => {
  try {
    nexmo.verify.request(
      {
        number: req.body.phone_number,
        brand: "Premyo",
        code_length: "6",
      },
      (err, result) => {
        if (err) throw err;
        response = successResponse(200, result, "Verification code sent.");
        res.status(response.status).send(response);
      }
    );
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};

cancelRequest = (req, res) => {
  nexmo.verify.control(
    {
      request_id: req.body.request_id,
      cmd: "cancel",
    },
    (err, result) => {
      try {
        if (err) throw err;
        // nexmo.verify.request(
        //   {
        //     number: req.body.phone_number,
        //     brand: "Premyo",
        //     code_length: "6",
        //   },
        //   (err, result) => {
        //     try {
        //       if (err) throw err;
        console.log("Cancelled");
        //     } catch (error) {
        //       response = errorResponse(500, error, "Service unavailable!");
        //       res.status(response.status).send(response);
        //     }
        //   }
        // );
     
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable!");
        res.status(response.status).send(response);
      }
    }
  );
};

checkRequest = (req, res) => {
  try {
    nexmo.verify.check(
      {
        request_id: req.body.request_id,
        code: req.body.code,
      },
      (err, result) => {
        if (err) throw err;
        response = successResponse(200, result, "Verified.");
        res.status(response.status).send(response);
      }
    );
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};

module.exports = { makeRequest, checkRequest, cancelRequest };
