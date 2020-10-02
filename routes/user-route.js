const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
let Model = require("../models/user");
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");
var response = null;
let feedsActivity = require("../helpers/feeds-activity");

let register = require("../modules/user/user.register");
let login = require("../modules/user/user.login");
let userQrCode = require("../modules/user/user.qr-code");
let addEstablishment = require("../modules/user/add-establishment");
let updateEstablishment = require("../modules/user/update-establishment");
let retrieveEstablishments = require("../modules/user/retrieve-establishments");
let retrieveEstablishment = require("../modules/user/retrieve-spec-establishment");
let retrieveStores = require("../modules/user/retrieve-stores");
let retrieveSubStores = require("../modules/user/retrieved-sub-stores");
let subscribeStore = require("../modules/user/user.subscribe-store");
let addPromo = require("../modules/user/user.add-promo");
let addNews = require("../modules/user/user.add-news")
router.post("/user/login", (req, res) => {
  login(req.body, res);
});

router.post("/user/register", (req, res) => {
  register(req.body.data, res);
});

router.post("/user/add/establishment", (req, res) => {
  addEstablishment(req, res);
});

router.post("/user/retrieve/qr-code", (req, res) => {
  userQrCode(req, res);
});

router.get("/user/retrieve/all", (req, res) => {
  res.send("this is a retrieve all api");
});

router.get("/user/retrieve/all-stores", (req, res) => {
  retrieveStores(req, res);
});

router.get("/user/retrieve/stores-subscribed/:id", (req, res) => {
  retrieveSubStores(req, res);
});

router.get("/user/subscribe-store/:user_id/:store_id", (req, res) => {
  subscribeStore(req, res);
});

router.get("/user/retrieve/subscribed-store/:store_id/:user_id", (req, res) => {  //MURAG MADALA RANIS FRONT-END
  Model.User.findById(req.params.user_id, (err, data) => {
    if (err) throw err;

    Model.Establishment.findById(
      req.params.store_id,
      {
        _id: 1,
        news: 1,
        posts: 1,
        name: 1,
        logo: 1,
      },
      (err, store) => {
        if (err) throw err;

        console.log(data.subscribed_stores[0].establishment_id);

        let subscribed_stores = data.subscribed_stores;
        let rewards = store.posts;
        // console.log(subscribed_stores);
        var item = subscribed_stores.find(
          (item) => item.establishment_id == store._id
        );
        console.log(item);
        console.log(rewards);

        let response = new Object({
          news: store.news,
          posts: store.posts,
          name: store.name,
          logo: store.logo,
          rewards: data.rewards,
        });
        res.send(response);
      }
    );
  });
});
// MAKUHA RANI SA FRONT END
// router.get("/user/retrieve/store/:id", (req, res) => {
//   res.send("this is a retrieve store api");
// });

router.get("/user/retrieve/store/my-reward", (req, res) => {
  res.send("this is a retrieve one store(subscribed/not) api");
});

router.get("/user/retrieve/account", (req, res) => {
  res.send("this is a retrieve account api");
});

router.put("/user/update/account", (req, res) => {
  res.send("this is an update account api");
});

router.post("/user/update/establishment", (req, res) => {
  updateEstablishment(req, res);
});

router.post("/user/retrieve/establishments", (req, res) => {
  retrieveEstablishments(req, res);
});

router.get("/user/retrieve/establishment/:id", (req, res) => {
  retrieveEstablishment(req, res);
});
//this route below is for establishments

router.post("/establishment/add/promo", (req, res) => {
  addPromo(req, res);
});

router.post("/establishment/add/news", (req, res) => {
  addNews(req, res);
});

router.get("/establishment/retrieve/all-news", (req, res) => {
  res.send("this is a retrieve news api");
});

router.get("/establishment/retrieve/all-promos", (req, res) => {
  res.send("this is a retrieve promos api");
});

router.get("/establishment/retrieve/daily-scanners", (req, res) => {
  res.send("this is a retrieve daily scanners api");
});

router.get("/establishment/retrieve/top-earners", (req, res) => {
  res.send("this is a retrieve top earners api");
});

router.get("/establishment/retrieve/account", (req, res) => {
  //NOTE : THIS IS OPTIONAL
  res.send("this is a retrieve establishment account api");
});

//this route is for employee

router.get("/employee/retrieve/user-details", (req, res) => {
  res.send("this is a retrieve customer details account api");
});

router.post("/employee/add/user-point", (req, res) => {
  res.send("this is to add user points");
});

module.exports = router;
