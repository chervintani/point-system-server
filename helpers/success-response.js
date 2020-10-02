var Response = require('./response');
var response = new Response();
module.exports = (status, body,message) => {
    var data = {
        body: body,
        message: message
    }
    response.setState(status, null, data)
    return response
}