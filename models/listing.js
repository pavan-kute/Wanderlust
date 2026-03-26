const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref } = require('joi');


const listingSchema = new Schema ({
    title: {
       type: String,
       require: true,       
    },
    description: String,
    // image:{
    //     // type : String,
    //    filename: String,
    //    url: String,
    // //    default:"https://plus.unsplash.com/premium_photo-1730101970568-f42653910817?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // //    set : (v) => v ==="" ? "https://plus.unsplash.com/premium_photo-1730101970568-f42653910817?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
    // //    :v,                   // termory opertor use for empty img
    // }
//     image: {
//   filename: {
//     type: String,
//     default: "listing_image"
//   },
//   url: {
//     type: String,
//     default:
//       "https://plus.unsplash.com/premium_photo-1730101970568-f42653910817?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//   }
// }

image: {
  url: String,
  filename: String,
}
,
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
      type: Schema.Types.ObjectId,   // one to many
      ref: "Review",
      }
    ] ,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
       await Review.deleteMany({_id : {$in: listing.reviews}})
  }
});


const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;