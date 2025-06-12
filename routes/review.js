const express = require("express");
const routes = express.Router({ mergeParams: true }); // merge params from parent route
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review = require("../modules/review.js");
const Listing = require("../modules/listing.js"); // ✅ Import Listing
const methodOverride = require("method-override");
const {validateReview , isLoggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

routes.use(methodOverride('_method'));



// POST /listings/:id/reviews
routes.post("/", isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

// DELETE /listings/:id/reviews/:reviewId
routes.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = routes;
