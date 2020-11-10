let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
    try {
        let establishment = await Model.Establishment.deleteOne({_id: req.params.id});
        response = successResponse(200, establishment,"Deleted successfully!");
        res.status(response.status).send(response);
    } catch (error) {
        response = errorResponse(500,error,"Service unavailable!");
        res.status(response.status).send(response);
    }

}