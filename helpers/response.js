class Response {
    constructor() {
        this.status = 200
        this.error = { message: null, body: null }
        this.data = {
            message: null,
            body: { accessToken: null }
        }
    }
    setState(status, error, data) {
        this.status = status || 200
        this.error = error 
        this.data = data
    }

    get state() {
        return this
    }
}
module.exports = Response