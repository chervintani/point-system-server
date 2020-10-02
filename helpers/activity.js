class Activity {
    constructor() {
        this.title = ""
        this.description = ""
        this.location = ""
        this.date = ""
    }
    setState(title,description,location,date) {
        this.title = title
        this.description = description
        this.location = location
        this.date = date
    }

    get state() {
        return this
    }
}

module.exports = Activity