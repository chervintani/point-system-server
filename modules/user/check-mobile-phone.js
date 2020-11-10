let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
    try {
        let users = await Model.User.find({});
        for (let index = 0; index < users.length; index++) {
            if(users[index].phone_number==req.params.phone_number){
                response = successResponse(200,{ exists: true},"Phone number already taken")
                return res.status(response.status).send(response);
            }
        }
        response = successResponse(200,{ exists: false},"Phone number is okay")
        return res.status(response.status).send(response);
    } catch (error) {
        response = errorResponse(500,error,"Service unavailable!")
        return res.status(response.status).send(response);
    }
}