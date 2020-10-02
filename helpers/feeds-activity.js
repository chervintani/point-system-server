var Activity = require('./activity');
var activity = new Activity();
module.exports = (titleParam,descriptionParam,locationParam,dateParam) => {
    let title = titleParam
    let description = descriptionParam
    let location = locationParam
    let date = dateParam

    activity.setState(title,description,location,date)
    return activity
}