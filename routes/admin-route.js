const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// let verifyToken = require("../helpers/verify-token");
let login = require("../modules/admin/admin.login");

let Model = require("../models/user");
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");
let response = null;

let retrieveStoresAndRequest = require("../modules/admin/admin-retrieve-allstores-request");
let retrieveStore = require("../modules/admin/admin-retrieve-store");
let updateStoreStatus = require("../modules/admin/admin-update-store-status");
let retrieveAllUsers = require("../modules/admin/admin-retrieve-all-user");
let retrieveUserData = require("../modules/admin/admin-retrieve-user-data");
let retrieveUserStoreSubscribe = require("../modules/admin/admin-retrieve-user-store-subscribed");
let retrieveUserOwnedStore = require("../modules/admin/admin-retrieve-user-user-account-user-owned-store");
let totalEstablishmentSubscribedByUser = require("../modules/admin/admin-user-total-store-subscribed");
let totalEstablishment = require("../modules/admin/admin-total-establishments");
let totalUsers = require("../modules/admin/admin-total-user");
let userOverAllTotalPoints = require("../modules/admin/admin-user-overalltotal-points");
let retrieveEstablishmentPromos= require("../modules/admin/admin-retrieve-establishment-promos");
let retrieveEstablishmentOffers = require("../modules/admin/admin-retrieve-establishment-offers");
let updateEstablishmentPromoStatus = require("../modules/admin/admin-update-establishmentPromo-status"); 
let updateEstablishmentOfferStatus = require("../modules/admin/admin-update-establishmentOffers-status");
let retrieveEstablishmentEmployees = require("../modules/user/establishment.retrieve-employees");
let retrievePost = require("../modules/admin/admin-retrieve-post");
let retrieveDailyScanners = require("../modules/admin/admin-establishment-daily-scanner");
let retrieveEstablishmentStatistics = require("../modules/user/establishment.retrieve-statistics");
let retrieveEstablishmentTopEarners = require("../modules/user/establishment.retrieve-top-earners");
let updateUserStatus = require("../modules/admin/admin-update-user-status");
let retrieveAllPendingPromos = require("../modules/admin/admin-retrieve-allestablishment-promo");
let retrieveAllPendingOffers = require("../modules/admin/admin-retrieve-allestablishment-offers");
let establishmentStats = require("../modules/user/establishment.retrieve-statistics");
let getNotifications = require("../modules/admin/admin-retrieve-notifications")
let updateUserAndPass = require("../modules/admin/admin-update-adminUserandPass");
const { Establishment } = require("../models/user");

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

// router.get("/pages/dashboard", verifyToken, (req, res) => {
//   let list = [];
//   res.json(list);
// });

router.get("/", (req, res) => {
  res.send("Hello! This is Pointsystem server");
});

router.post("/login/admin", (req, res) => {
  login(req, res);
});

router.get("/admin/retrieve/all-users", async (req, res) => {
  retrieveAllUsers(req, res);
});

router.get("/admin/retrieve/user/:id", async (req, res) => {
  retrieveUserData(req, res);
});

router.get("/admin/retrieve/user/user-account/post:id", async (req, res) => {
  retrieveUserData(req, res);
});

router.get("/admin/retrieve/stores", async (req, res) => {
  retrieveStoresAndRequest(req, res);
});

router.get("/admin/retrieve/store/:id", async (req, res) => {
  retrieveStore(req, res);
});

router.get("/admin/retrieve/total-establishment", async (req, res) => {
  totalEstablishment(req, res);
});

router.get(
  "/admin/retrieve/user/user-total-store-subscribed/:id",
  async (req, res) => {
    totalEstablishmentSubscribedByUser(req, res);
  }
);

router.get(
  "/admin/retrieve/user/user-overalltotal-points/:id",
  async (req, res) => {
    userOverAllTotalPoints(req, res);
  }
);

router.get("/admin/retrieve/total-users", async (req, res) => {
  totalUsers(req, res);
});

router.get("/admin/retrieve/establishment-stats", async (req, res) => {
  establishmentStats(req, res);
});



router.put("/admin/update/store-status", (req, res) => {
  console.log(req.body);
  updateStoreStatus(req, res);
});

router.put("/admin/update/establishmentPromo-status", (req, res) => {
  updateEstablishmentPromoStatus(req, res);
  
});

router.put("/admin/update/establishmentOffer-status", (req, res) => {
  updateEstablishmentOfferStatus(req, res);
});

router.put("/admin/update/user-status", (req, res) => {
  updateUserStatus(req, res);
});

router.get(
  "/admin/retrieve/user/user-account/user-store-subscribed/:id",
  async (req, res) => {
    retrieveUserStoreSubscribe(req, res);
  }
);

router.get("/admin/retrieve/notifications", async (req, res) => {
  getNotifications(req, res);
});

router.get(
  "/admin/retrieve/establishment/establishment-employees/:id",
  async (req, res) => {
    retrieveEstablishmentEmployees(req,res);
}
);

router.get("/admin/retrieveEstablishment/daily-scanners/:id/:date", (req, res) => {
  retrieveDailyScanners(req, res);
});


router.get(
  "/admin/retrieve/user/user-account/user-owned-store/:id",
  async (req, res) => {
    retrieveUserOwnedStore(req, res);
  }
);

router.get("/admin/retrieve/establishment-promos/:id", async (req, res) => {
  retrieveEstablishmentPromos(req,res);
});


router.get("/admin/retrieve/establishment-offers/:id", async (req, res) => {
  retrieveEstablishmentOffers(req,res);
});

router.get("/admin/retrieve/post", async (req, res) => {
  retrievePost(req,res);
});

router.get("/admin/retrieve/establishment/statistics/:id", async (req, res) => {
  retrieveEstablishmentStatistics(req,res);
});

router.get("/admin/retrieve/establishment/top-earner/:id", async (req, res) => {
  retrieveEstablishmentTopEarners(req,res);
});

router.get("/admin/retrieve/allestablishment-promo-waiting", async (req, res) => {
  retrieveAllPendingPromos(req,res);
});

router.get("/admin/retrieve/allestablishment-offer-waiting", async (req, res) => {
  retrieveAllPendingOffers(req,res);
});

router.put("/admin/retrieve/userAndPass", async (req, res) => {
  updateUserAndPass(req,res);
});

module.exports = router;
