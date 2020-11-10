let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
    try {
        let user = await Model.User.findById(req.params.id, {feeds_activity:0});
        console.log(user);
        response = successResponse(200, user, "Retrieved successfully");
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(404, error, "Not found!");
        res.status(response.status).send(response);
      }
}