let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;
module.exports = async(req, res) => {
try {
    let updateUserStatus = await Model.User.findById(req.body.id);
    console.log(updateUserStatus);
    updateUserStatus.status = req.body.status
    await updateUserStatus.save();

    response = successResponse(200,{success:true},"Updated user status successfully")
    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).json(error);
  }
}