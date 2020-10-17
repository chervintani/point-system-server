let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = (req, res) => {
    try {
        Model.Establishment.findOne({
          _id: req.body.establishment_qr_code.establishment_id,
        })
          .populate({
            path: "employees",
            match: {
              _id: req.body.id,
            },
          })
          .exec((err, establishment) => {
            try {
              if (err) throw err;
              let employees = establishment.employees;
              if (!employees.length) {
                if (establishment.lock_employees) {
                  response = errorResponse(401, 
                    {message:"Unauthorized!"}, 
                    "You are not an employee of that establishment!");
                  res.status(response.status).send(response);
                } else {
                  Model.User.findById(req.body.id, (err, user) => {
                    try {
                      if (err) throw err;
    
                      user.employee.status = true;
                      user.save((err) => {
                        if (err) {
                          response = errorResponse(500, error, "Internal server error!");
                          res.status(response.status).send(response);
                        }
                      });
                      establishment.employees.push(user);
    
                      establishment.save((err) => {
                        try {
                          if (err) throw err;
    
                          response = successResponse(200, {success: true}, `You are now an employee of ${establishment.name}`);
                          res.status(response.status).send(response);
                        } catch (error) {
                          response = errorResponse(500, error, "Service unavailable!");
                          res.status(response.status).send(response);
                        }
                      });
                    } catch (error) {
                      response = errorResponse(400, error, "Bad Request!");
                      res.status(response.status).send(response);
                    }
                  });
                }
              } else {
                response = successResponse(200, {success: true}, "Your status has been changed to employee.");
                res.status(response.status).send(response);
              }
            } catch (error) {
              response = errorResponse(400, error, "Bad Request!");
              res.status(response.status).send(response);
            }
            // employee.filter((user) => {
            //   res.send(user);
            // });
          });
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable!");
        res.status(response.status).send(response);
      }
}