const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// let verifyToken = require("../helpers/verify-token");
let Model = require("../models/user");
let login = require("../modules/admin/admin.login");

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
