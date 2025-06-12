
const express = require("express");
const routes = express.Router();
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const Listing = require("../modules/listing");
const methodOverride = require("method-override");
routes.use(methodOverride("_method"));
const {storage} = require("../cloudconfig.js");
const multer  = require('multer')
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");


routes.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing,wrapAsync(listingController.createListings));


  // Show new listing form
routes.get("/new", isLoggedIn, listingController.renderNew);
// #Show listing details #Update listing  #deleteing
routes.route("/:id")
  .get(isLoggedIn, wrapAsync(listingController.showListings))
  .put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListings))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListings));




// Show edit form
routes.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.editListings));










module.exports = routes;