const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
    },
    time:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports = mongoose.model("Review",reviewSchema);