let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
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
      .exec(async (err, establishment) => {
        try {
          if (err) throw err;

          let employees = establishment.employees;
          if (!employees.length) {
            if (establishment.lock_employees) {
              response = errorResponse(
                401,
                { message: "Unauthorized!" },
                "You are not an employee of that establishment!"
              );
              res.status(response.status).send(response);
            } else {
              Model.User.findById(req.body.id, (err, user) => {
                try {
                  if (err) throw err;

                  user.employee.status = true;
                  user.employee.establishment_id = establishment._id;
                  user.save((err) => {
                    if (err) {
                      response = errorResponse(
                        500,
                        error,
                        "Internal server error!"
                      );
                      res.status(response.status).send(response);
                    }
                  });

                  establishment.employees.push(user);

                  establishment.save(async (err) => {
                    try {
                      if (err) throw err;

                      let today = new Date().toString();
                      today = today.substring(0, 15);

                      let data = {
                        date: today,
                        statistics_date: Date.now(),
                        employee: [
                          {
                            user_id: req.body.id,
                            time_in: new Date().toString(),
                            time_out: "",
                            processed: {
                              price: 0,
                              points: 0
                            }
                          },
                        ],
                      };

                      // check if the date is existed
                      let existDate = establishment.daily_scanners.find(
                        (scanner) => scanner.date == today
                      );

                      if (!existDate) {
                        establishment.daily_scanners.push(data);
                        await establishment.save();
                      } else {
                        //for duplication of employee
                        let index = establishment.daily_scanners.findIndex(
                          (element) => {
                            //index of the current date
                            return element.date === today;
                          }
                        );
                        let findEmployee = establishment.daily_scanners[
                          index
                        ].employee.find((element) => {
                          return element.user_id == req.body.id;
                        });
                        if (findEmployee) {
                          console.log(findEmployee);
                          const i = establishment.daily_scanners[
                            index
                          ].employee.indexOf(findEmployee);
                          if (i > -1) {
                            establishment.daily_scanners[index].employee.splice(
                              i,
                              1
                            );
                            await establishment.save();
                          }
                        }
                        let employee = {
                          user_id: req.body.id,
                          time_in: new Date().toString(),
                          time_out: "",
                          processed: {
                            price: 0,
                            points: 0
                          }
                        };

                        establishment.daily_scanners[index].employee.push(
                          employee
                        );
                        await establishment.save();
                      }

                      response = successResponse(
                        200,
                        req.body.establishment_qr_code.establishment_id,
                        `You are now an employee of ${establishment.name}`
                      );
                      res.status(response.status).send(response);
                    } catch (error) {
                      response = errorResponse(
                        500,
                        error,
                        "Service unavailable!"
                      );
                      res.status(response.status).send(response);
                    }
                  });
                  // }
                } catch (error) {
                  response = errorResponse(400, error, "Bad Request!");
                  res.status(response.status).send(response);
                }
              });
            }
          } else {
            let today = new Date().toString();
            today = today.substring(0, 15);

            let data = {
              date: today,
              statistics_date: Date.now(),
              employee: [
                {
                  user_id: req.body.id,
                  time_in: new Date().toString(),
                  time_out: "",
                  processed: {
                    price: 0,
                    points: 0
                  }
                },
              ],
            };

            // check if the date is existed
            let existDate = establishment.daily_scanners.find(
              (scanner) => scanner.date == today
            );

            if (!existDate) {
              establishment.daily_scanners.push(data);
              await establishment.save();
            } else {
              //for duplication of employee
              let index = establishment.daily_scanners.findIndex((element) => {
                //index of the current date
                return element.date === today;
              });
              let findEmployee = establishment.daily_scanners[
                index
              ].employee.find((element) => {
                return element.user_id == req.body.id;
              });
              if (findEmployee) {
                console.log(findEmployee);
                const i = establishment.daily_scanners[index].employee.indexOf(
                  findEmployee
                );
                if (i > -1) {
                  establishment.daily_scanners[index].employee.splice(i, 1);
                  await establishment.save();
                }
              }
              let employee = {
                user_id: req.body.id,
                time_in: new Date().toString(),
                time_out: "",
                processed: {
                  price: 0,
                  points: 0
                }
              };

              establishment.daily_scanners[index].employee.push(employee);
              await establishment.save();
            }
            response = successResponse(
              200,
              req.body.establishment_qr_code.establishment_id,
              "Your status has been changed from customer to employee."
            );
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
};
