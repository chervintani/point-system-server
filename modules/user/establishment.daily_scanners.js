let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
    try {
        let establishment = await Model.Establishment.findById(req.params.id);
        let result = establishment.daily_scanners.find(scanner =>{return scanner.date==req.params.date});
        response = successResponse(200,result,`Retrieved ${req.params.date} successfully`)
        res.status(response.status).send(response);
      } catch (error) {
        response = errorResponse(404,error,"Not found!");
        res.status(response.status).send(response);
      }
}