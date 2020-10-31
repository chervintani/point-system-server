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
//totalpoints earn
router.get(
  "/admin/retrieve/user/user-overalltotal-points/:id",
  async (req, res) => {
    userOverAllTotalPoints(req, res);
  }
);

router.get("/admin/retrieve/total-users", async (req, res) => {
  totalUsers(req, res);
});

router.put("/admin/update/store-status", async (req, res) => {
  console.log(req.body);
  updateStoreStatus(req, res);
});

router.put("/admin/update/establishmentPromo-status", async (req, res) => {
  updateEstablishmentPromoStatus(req, res);
  
});

router.put("/admin/update/establishmentOffer-status", async (req, res) => {
  updateEstablishmentOfferStatus(req, res);
});



router.get(
  "/admin/retrieve/user/user-account/user-store-subscribed/:id",
  async (req, res) => {
    retrieveUserStoreSubscribe(req, res);
  }
);

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

module.exports = router;
