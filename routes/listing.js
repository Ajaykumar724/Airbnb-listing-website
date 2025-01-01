const express = require("express");
const router = express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const {listingSchema , reviewSchema} = require('../joi.js');
const {loggedIn , isOwner , validateSchema} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

 
router.route("/")
.get(wrapAsync(listingController.index))//Index Route
.post(loggedIn,upload.single("listing[image]"),validateSchema,wrapAsync(listingController.createListing)); //Create Route

//trending route
router.get("/trending",listingController.trendingListing);

 // new Route
 router.get("/new",loggedIn,listingController.renderNewForm);

  // Search Route
router.get("/search", wrapAsync(listingController.searchListing));
router.route("/:id")
.get(wrapAsync(listingController.showListing)) //Show Route
.put(loggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing)) //Update Route
.delete(loggedIn,isOwner , wrapAsync(listingController.destroyListing)); //Delete Route



 
 //Edit Route
 router.get("/:id/edit",loggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 
 module.exports = router;