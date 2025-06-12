const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");

const userController = require("../controllers/users.js");


//signup from #signup 
router.route("/signup").get(userController.renderSignupFrom)
    .post(wrapAsync(userController.signupUser));

//login
router.route("/login").get(userController.renderloginFrom)
    .post(saveRedirectUrl,passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}), userController.login);

// Handle logout on GET request (for the <a> tag)
router.get("/logout", userController.logout);


module.exports = router;

