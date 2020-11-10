let Model = require("../../models/user");
let errorResponse = require("../../helpers/error-response");
let successResponse = require("../../helpers/success-response");
let response = null;

module.exports = async (req, res) => {
    try {
        let post = await Model.Post.findById(req.body.post_id);
        post.likes.push(req.body.user_id);
        await post.save();
        response = successResponse(200,{success:true},"Added like");
        res.status(response.status).send(response);
    } catch (error) {
        response = errorResponse(500,error,"Failed");
        res.status(response.status).send(response); 
    }
}