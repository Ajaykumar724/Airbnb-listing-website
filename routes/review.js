const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utiles/wrapAsync.js");
const { validateReviewSchema , loggedIn , isReviewAuthor } = require("../middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const reviewController = require("../controllers/review.js");



// post review route
router.post("/",loggedIn,validateReviewSchema,wrapAsync(reviewController.postReview));

// review delete route
router.delete("/:reviewId",loggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;