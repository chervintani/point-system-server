var Response = require('./response');
var response = new Response();
module.exports = (status, body, message) => {
    let error = {
        message: body
    }
    let data = message
    response.setState(status, error, data)
    return response.state
}