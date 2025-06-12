const Review = require("../modules/review.js");
const Listing = require("../modules/listing.js");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) throw new expressError(404, "Listing not found");
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}