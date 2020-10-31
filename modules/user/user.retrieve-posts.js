let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
  try {
    let posts = await Model.Post.find({}).sort({ date_created: "desc" }).exec();
    response = successResponse(200, posts, "Retrieve posts successfully");
    res.status(response.status).send(response);
  } catch (error) {
    response = errorResponse(500,error, "Service unavailable");
    res.status(response.status).send(response);
  }
};
