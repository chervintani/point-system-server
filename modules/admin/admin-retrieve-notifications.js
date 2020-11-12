let Model = require("../../models/user");

module.exports = async (req, res) => {
    try {
        let notifications = await Model.AdminNotification.find({});
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).json(error)
    }
    
}