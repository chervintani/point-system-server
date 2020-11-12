let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let establishments = await Model.Establishment.find(
      {},
      { promos: 1, name: 1, _id: 0 },
      {sort: {_id:-1}}
    )
      .populate("promos")
      .exec();
    let result = [];
    for (let index = 0; index < establishments.length; index++) {
      establishments[index].promos.forEach((promo) => {
        result.push({
          establishment_name: establishments[index].name,
          promos: promo,
        });
      });
    }
    response = successResponse(200, result, "Promos retrieved successfully!");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500, result, "Service unavailable!");
    res.status(response.status).send(response);
  }
};
