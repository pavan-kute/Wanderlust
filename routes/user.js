const express = require('express');
const router = express.Router({mergeParams: true});     // by deafault add kr na error aya tho
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")


   // require controller
const userController = require("../controllers/users.js");

     // Router.route 
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}),
    userController.login)

      //  logout
router.get("/logout",userController.logout);


module.exports = router;