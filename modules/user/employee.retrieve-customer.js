let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req,res)=>{
    try {
        let result = await Model.User.findById(req.body.user_id);
        let points = result.subscribed_stores.find((store) => {
          return store.establishment == req.body.establishment_id;
        });
        let data = {
          firstname: result.firstname,
          lastname: result.lastname,
          points: points.points,
        };
        response = successResponse(200, data, "Retrieved customer successfully");
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(500, error, "Service unavailable!");
        res.status(response.status).send(response);
      }
}