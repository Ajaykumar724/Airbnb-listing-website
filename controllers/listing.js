const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.Map_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken : mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
 };

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
 };

module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
       req.flash("error","Listing you resquested was deteled");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
};

module.exports.createListing = async (req,res,next)=>{

   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();


    let filename = req.file.filename;
    let url = req.file.path;
    let newListing = new Listing(req.body.listing) ;
    newListing.owner = req.user._id;
    newListing.image = { url , filename};
    newListing.geometry = response.body.features[0].geometry;
   let mainListing = await newListing.save();
   console.log(mainListing);
    req.flash("success","New listing added");
    res.redirect("/listings");   
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you resquested was deteled");
       res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{ listing , originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    const {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url , filename};
      await listing.save();
    }

    req.flash("success","Listing is Edited");
    res.redirect(`/listings/${id}`);
    console.log("updated");
};

module.exports.destroyListing = async (req,res)=>{
    let {id} =req.params;
   const deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing is Deleted");
   res.redirect("/listings");
};

module.exports.trendingListing = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/trending.ejs",{allListings});
};

module.exports.searchListing = async (req,res)=>{
  try{
    let inp = req.query.search;
    let loc = req.query.location;
    const searchedListing = await Listing.find({title:inp});
    const searchedListing2 = await Listing.find({location:loc});
    res.render("listings/search.ejs",{searchedListing,searchedListing2});
  }catch (e){
    throw e;
  }
};

