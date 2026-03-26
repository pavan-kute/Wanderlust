const Listing = require ("./models/listing")
const Review = require ("./models/review")
const ExpressError = require ("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require ("./schema.js") 




   module.exports.isLoggedIn = (req,res,next)=>{
   if(!req.isAuthenticated()){
    //redirectUrl save
    req.session.redirectUrl = req.originalUrl;   // login krne ke bad vahi path pr jane liye
    req.flash("error", "you must be logged in to create listing !")   // flash  msg
    return res.redirect("/login");
   }
   next();
}


module.exports.saveRedirectUrl = (req,res,next) => {
     if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
     }
    next();
}



  //  midleware use for koi bhi edit or update kuch na kare autherization

  module.exports.isOwner = async (req, res, next) => {
      const { id } = req.params;   
      let listing = await Listing.findById(id)     // permission for edits L.7 authorization
     if (!listing.owner.equals(req.user._id)){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
     }
     next();
  }


          // validation listing middleware

    
  module.exports.validateListing = (req,res,next)=>{
      let {error} = listingSchema.validate (req.body)    // using joi validation package
      if(error) {
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
      }
      else {
      next();
      }
      };


   

           // validation review middlware function  use for reviews not empty send for hosspecotche postaman se
          
          module.exports.validateReview = (req,res,next)=>{
          let {error} = reviewSchema.validate (req.body)    // using joi validation package
          if(error) {
          let errMsg = error.details.map((el)=> el.message).join(",");
          throw new ExpressError(400,errMsg);
          }
          else {
          next();
          }
          };

   
      
   //  midleware use for koi bhi reviwe delete na jisne crate kiya hoi delete kre

  module.exports.isReviewAuthor = async (req, res, next) => {
      const {id,  reviewId } = req.params;   
      let review = await Review.findById(reviewId)     // L.11
     if (!review.author.equals(res.locals.currUser._id)){                      //req.user._id
      req.flash("error","You are not the Author of this Review");
      return res.redirect(`/listings/${id}`);
     }
     next();
  }
