const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require ("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { populate } = require('../models/review.js');
const { authorize } = require('passport');
const multer  = require('multer')   // multer npm package use for pasring data file img uploads
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

    // require controller
const listingController = require("../controllers/listings.js");

     // Router.route 
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing))




  // New routes
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

  // Edit Routes
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  

module.exports = router;