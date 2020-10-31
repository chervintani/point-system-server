let Model = require("../../models/user");

module.exports = async (req, res) => {
  try {
    let query = {
      firstname: true,
      lastname: true,
      phone_number: true,
      total_points: true,
      created_at: true,
    };
    let users = await Model.User.find({}, query);
    res.send(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
