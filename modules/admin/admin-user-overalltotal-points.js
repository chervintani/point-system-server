let Model = require("../../models/user");

module.exports = async (req, res) => {
try {
    Model.User.find({_id:req.params.id},{subscribed_stores:true}).exec((err, result) => {
      if (err) return err;
      let total=0;
      result[0].subscribed_stores.forEach(item=> {
        total += item.points;
      });
      
      res.status(200).json(total);
    })
  } catch (error) {
    res.status(500).json(error);
  }
}