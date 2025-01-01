const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./review.js");

let listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2024/05/24/08/52/birds-8784588_1280.jpg",
        },
        url: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2024/05/24/08/52/birds-8784588_1280.jpg",
            set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2024/05/24/08/52/birds-8784588_1280.jpg" : v,
        }

    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      trending:String,

});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews }})
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;