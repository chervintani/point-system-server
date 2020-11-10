const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
let Model = require("../models/user");
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");
var response = null;

let feedsActivity = require("../helpers/feeds-activity");
let smsVerification = require("../modules/user/sms-verification");
let register = require("../modules/user/user.register");
let login = require("../modules/user/user.login");
let userQrCode = require("../modules/user/user.qr-code");
let establishmentQrCode = require("../modules/user/establishment.qr-code");
let addEstablishment = require("../modules/user/add-establishment");
let updateEstablishment = require("../modules/user/update-establishment");
let retrieveEstablishments = require("../modules/user/retrieve-establishments");
let retrieveEstablishment = require("../modules/user/retrieve-spec-establishment");
let retrieveStores = require("../modules/user/retrieve-stores");
let retrieveSubStores = require("../modules/user/retrieved-sub-stores");
let subscribeStore = require("../modules/user/user.subscribe-store");
let addPromo = require("../modules/user/user.add-promo");
let addOffer = require("../modules/user/user.add-offer");
let retrieveDailyScanners = require("../modules/user/establishment.daily_scanners");
let retrieveEmployees = require("../modules/user/establishment.retrieve-employees.js");
let updateAccount = require("../modules/user/user.update-account");
let updatePassword = require("../modules/user/user.update-password");
let retrieveStore = require("../modules/user/user.retrieve-store");
let retrieveUser = require("../modules/user/user.retrieve");
let retrievePost = require("../modules/user/user.retrieve-posts");
let retrieveNotifications = require("../modules/user/user.retrieve-notifications");
let addLike = require("../modules/user/user.add-like");
let removeLike = require("../modules/user/user.remove-like");
let deleteEstablishment = require("../modules/user/user.delete-establishment");
let checkPhoneNumber = require("../modules/user/check-mobile-phone");
//establishment
let retrieveStatistics = require("../modules/user/establishment.retrieve-statistics");
let retrieveTopEarners = require("../modules/user/establishment.retrieve-top-earners");
let lockEmployees = require("../modules/user/establishment.lock-employees");
let removeEmployee = require("../modules/user/establishment.remove-employee");
let removePost = require("../modules/user/establishment.remove-post");
//employee
let scanEstablishment = require("../modules/user/employee.scan-establishment");
let timeoutEstablishment = require("../modules/user/employee.time-out");
let retrieveCustomer = require("../modules/user/employee.retrieve-customer");
let addPoint = require("../modules/user/employee.add-point");
let deductPoint = require("../modules/user/employee.deduct-point");
let retrieveDelivery = require("../modules/user/employee.retrieve-deliveries");
router.post("/sms-send-verification", (req, res) => {
  //phone_number
  smsVerification.makeRequest(req, res);
});

router.post("/sms-check-verification", (req, res) => {
  //request_id & code
  smsVerification.checkRequest(req, res);
});

router.post("/sms-resend-verification", (req, res) => {
  //phone_number & request_id
  smsVerification.cancelRequest(req, res);
  smsVerification.makeRequest(req, res);
});

// router.post("/sms-verification", (req, res) => {
//   smsVerification(req, res);
// });

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

router.get("/user/retrieve/details/:id", async (req, res) => {
  retrieveUser(req, res);
});

router.get("/user/retrieve/all-stores", (req, res) => {
  retrieveStores(req, res);
});

router.get("/user/retrieve/stores-subscribed/:id", (req, res) => {
  retrieveSubStores(req, res);
});

router.put("/user/subscribe-store/:user_id/:store_id/:location", (req, res) => {
  subscribeStore(req, res);
});

router.get("/user/retrieve/store/:id", (req, res) => {
  retrieveStore(req, res);
});

router.get("/user/retrieve/store/my-reward", (req, res) => {
  res.send("this is a retrieve one store(subscribed/not) api");
});

router.get("/user/retrieve/account", (req, res) => {
  res.send("this is a retrieve account api");
});

router.get("/user/retrieve/posts", (req, res) => {
  retrievePost(req, res);
});

router.put("/user/update/account", (req, res) => {
  updateAccount(req, res);
});

router.put("/user/update/password", (req, res) => {
  updatePassword(req, res);
});

router.post("/user/add/like", (req, res) => {
  addLike(req, res);
});

router.post("/user/remove/like", (req, res) => {
  removeLike(req, res);
});

router.put("/user/update/establishment", (req, res) => {
  updateEstablishment(req, res);
});

router.get("/user/retrieve/establishments/:id", (req, res) => {
  retrieveEstablishments(req, res);
});

router.get("/user/retrieve/establishment/:id", (req, res) => {
  retrieveEstablishment(req, res);
});

router.get("/user/retrieve/notifications/:id", (req, res) => {
  retrieveNotifications(req, res);
});

router.get("/user/check/mobile-number/:phone_number", (req, res) => {
  checkPhoneNumber(req, res);
});

router.delete("/user/delete/establishment/:id", (req, res) => {
  deleteEstablishment(req, res);
});

//this route below is for establishments

router.post("/establishment/add/promo", (req, res) => {
  addPromo(req, res);
});

router.post("/establishment/add/offer", (req, res) => {
  addOffer(req, res);
});

router.get("/establishment/retrieve/qr-code/:id", async (req, res) => {
  establishmentQrCode(req, res);
});

router.get("/establishment/retrieve/statistics/:id", (req, res) => {
  retrieveStatistics(req, res);
});

router.get("/establishment/retrieve/all-promos", (req, res) => {
  res.send("this is a retrieve promos api");
});

router.get("/establishment/retrieve/daily-scanners/:id/:date", (req, res) => {
  retrieveDailyScanners(req, res);
});

router.get("/establishment/retrieve/top-earners/:id", (req, res) => {
  retrieveTopEarners(req, res);
});

router.get("/establishment/retrieve/employees/:id", (req, res) => {
  retrieveEmployees(req, res);
});

router.put("/establishment/update/lock-employees", (req, res) => {
  lockEmployees(req, res);
});

router.delete(
  "/establishment/remove/employee/:establishment_id/:employee_id",
  (req, res) => {
    removeEmployee(req, res);
  }
);

router.post(
  "/establishment/remove/post",
  (req, res) => {
    removePost(req, res);
  }
);

//this route is for employee

router.post("/employee/scan-establishment", (req, res) => {
  scanEstablishment(req, res);
});

router.post("/employee/timeout-establishment", (req, res) => {
  timeoutEstablishment(req, res);
});

router.get("/employee/retrieve/user-details", async (req, res) => {
  retrieveCustomer(req, res);
});

router.post("/employee/add/user-point", async (req, res) => {
  addPoint(req, res);
});

router.post("/employee/deduct/user-point", async (req, res) => {
  deductPoint(req, res);
});

router.get(
  "/employee/retrieve/deliveries/:establishment_id",
  async (req, res) => {
    retrieveDelivery(req, res);
  }
);

module.exports = router;
