const Listing = require("../modules/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Render form to create new listing
module.exports.renderNew = (req, res) => {
    res.render("listings/new.ejs");
};

// INDEX — list all listings with optional filter by placeType
module.exports.index = async (req, res) => {
    const { placeType } = req.query;
    let listings;
    if (placeType && placeType !== "all") {
        listings = await Listing.find({ placeType });
    } else {
        listings = await Listing.find({});
    }
    res.render("listings/index.ejs", { listings, placeType: placeType || "all" });
};

// CREATE — create a new listing
module.exports.createListings = async (req, res) => {
    const geoResponse = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    newListing.geometry = geoResponse.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

// SHOW — show details of a single listing
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// RENDER EDIT FORM
module.exports.editListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE — update a listing
module.exports.updateListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE — delete a listing
module.exports.destroyListings = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
