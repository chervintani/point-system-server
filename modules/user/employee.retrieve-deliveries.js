let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let deliveries = await Model.Delivery.find({
      establishment_id: req.params.establishment_id,
    })
      .populate("orders")
      .exec();
    let result = [];
    deliveries.forEach(async element => {
      if(element.date_created.substring(0,15)==new Date().toDateString().toString()){
          result.push(element)
        }else{
          await Model.Delivery.deleteOne({_id: element._id})
        }
      });
    response = successResponse(
      200,
      result,
      "Retrieve deliveries successfully"
    );
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, error, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
