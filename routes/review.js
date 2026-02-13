const express = require('express');
const router = express.Router({mergeParams: true});   // merge param use for psrent id ko use problemm comment
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const Review = require ("../models/review.js");
const Listing = require ("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")
  
     // require controller
const reviewController = require("../controllers/reviews.js");
const review = require ("../models/review.js")
     
     // Post  Revies Routes 
router.post("/",isLoggedIn, validateReview,wrapAsync (reviewController.createReview));

    // Revies delete routes

    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

    module.exports= router;