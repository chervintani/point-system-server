const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// let verifyToken = require("../helpers/verify-token");
let login = require("../modules/admin/admin.login");

let Model = require("../models/user");
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");
let response = null;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.username = payload.subject;
  next();
}

router.get("/pages/dashboard", verifyToken, (req, res) => {
  let list = [];
  res.json(list);
});

router.get("/", (req, res) => {
  res.send("Hello! This is Pointsystem server");
});

router.post("/login/admin", (req, res) => {
  login(req.body, res);
});

router.get("/admin/retrieve/all-users", async (req, res) => {
  try {
    let query = {firstname:true , lastname:true, phone_number:true, total_points: true, created_at:true}
    let users = await Model.User.find({},query);
    res.send(users)
  } catch (error) {
    res.status(500).json(error)
  }
});

router.get("/admin/retrieve/user/:id", async (req, res) => {
  try {
    let user = await Model.User.findOne({_id:req.params.id});
    res.status(200).send(user)
  } catch (error) {
    res.status(500).json(error)
  }
});
router.get("/admin/retrieve/user/user-account/user-store-subscribed/:id", async (req, res) => {
  const result = await Model.User.find({_id:req.params.id},{subscribed_stores:true})
  // res.status(200).send(user)
  .populate({
    path: "subscribed_stores.establishment",
    model: "Establishment",
    select: ["name"]
  })
  .exec();
  res.send(result);
});


// router.post("/user/find-qr", (req, res) => {
//   console.log(req.body);

//   Model.User.findOne({username: 'String'},  (err, user)=> {

//     var photos = user.rewards.filter( (photo)=> {
//       return photo.points === 3;
//     }).pop();
  
//     console.log(photos); 
//   });
// });
module.exports = router;
