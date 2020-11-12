let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let establishments = await Model.Establishment.find(
      {},
      { offers: 1, name: 1, _id: 0 },
      {sort: {_id:-1}}
    )
      .populate("offers")
      .exec();
    let result = [];
    for (let index = 0; index < establishments.length; index++) {
      establishments[index].offers.forEach((offer) => {
        result.push({
          establishment_name: establishments[index].name,
          offer: offer,
        });
      });
    }
    response = successResponse(200, result, "Offers retrieved successfully!");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, result, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
