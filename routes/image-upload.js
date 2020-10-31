const express = require("express");
const router = express.Router();
let Model = require("../models/user");
let errorResponse = require("../helpers/error-response");
let successResponse = require("../helpers/success-response");
var response = null;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const del = require("del");

let UPLOAD_PATH = "./uploads/";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
let upload = multer({ storage: storage });

// Upload a new image with description
router.post("/images", upload.single("image"), (req, res, next) => {
  // Create a new image model and fill the properties
  let newImage = new Model.Image();
  newImage.filename = req.file.filename;
  newImage.originalName = req.file.originalname;
  newImage.desc = req.body.desc;
  newImage.save((err) => {
    try {
      if (err) {
        throw err;
      }
      console.log({ newImage });
      response = successResponse(200, { newImage }, "Image saved successfully");
      res.status(response.status).send(response);
    } catch (error) {
      response = errorResponse(400, error, "Bad Request!");
      res.status(response.status).send(response);
    }
  });
});

// Get all uploaded images
router.get("/images", (req, res, next) => {
  // use lean() to get a plain JS object
  // remove the version key from the response
  Model.Image.find({}, "-__v")
    .lean()
    .exec((err, images) => {
      try {
        if (err) {
          throw err;
        }
      } catch (error) {
        response = errorResponse(400, error, "Bad Request!");
        res.status(response.status).send(response);
      }

      // Manually set the correct URL to each image
      for (let i = 0; i < images.length; i++) {
        var img = images[i];
        img.url = req.protocol + "://" + req.get("host") + "/images/" + img._id;
      }
      res.json(images);
    });
});

router.get("/images/:id", (req, res, next) => {
  let imgId = req.params.id;

  Model.Image.findById(imgId, (err, image) => {
    if (err) {
      response = errorResponse(400, err, "Bad Request!");
      res.status(response.status).send(response);
    }
    // stream the image back by loading the file
    res.setHeader("Content-Type", "image/jpeg");
    fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
  });
});
// Delete one image by its ID
router.delete("/images/:id", (req, res, next) => {
  let imgId = req.params.id;

  Model.Image.findByIdAndRemove(imgId, (err, image) => {
    try {
      if (err && image) {
        throw err;
      }
    } catch (error) {
      response = errorResponse(400, error, "Bad Request!");
      res.status(response.status).send(response);
    }

    if (!image) {
      response = errorResponse(404, { success: false }, "Not found!");
      return res.status(response.status).send(response);
    } else {
      del([path.join(UPLOAD_PATH, image.filename)]).then((deleted) => {
        response = successResponse(200, deleted, "Deleted successfully");
        res.status(response.status).send(response);
      });
    }
  });
});

module.exports = router;
