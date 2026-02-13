  const Listing = require("../models/listing") 
   
   
   // index routes
   module.exports.index = async (req,res)=>{
   const allListing = await Listing.find({})
   res.render("listings/index.ejs",{allListing});
}
  
    // New routes
   module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
   };
          
        // show routes
   module.exports.showListing = async (req,res)=>{
      let {id} = req.params;
      const listing = await Listing.findById(id).populate({
     path: "reviews",
     populate: {
       path: "author",
     },
   })
     .populate("owner");
       if(!listing){
       req.flash("error", "Listing you requested for does not exists !")   // flash  msg
       return res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs", {listing});
     };

            // Create Routes
   module.exports.createListing = async (req,res,next)=>{
         let url = req.file.path;
         let filename = req.file.filename;
         const newListing = new Listing (req.body.listing);
         newListing.owner = req.user._id;
         newListing.image = {url, filename};
         await newListing.save();
         req.flash("success", "New Listing Ceated!")   // flash  msg
         res.redirect("/listings");
         };

                // Edit Routes
   module.exports.renderEditForm = async (req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
        req.flash("error", "Listing you requested for does not exists !")   // flash  msg
        return res.redirect("/listings");
       }
        let originalImageUrl = listing.image.url;
        originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs",{listing, originalImageUrl});
      };
         

              // update Routes
    module.exports.updateListing = async (req,res)=>{
      let {id} = req.params;  
      let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

      if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
  }
      req.flash("success", "Listing updated !")
      res.redirect(`/listings/${id}`);
    };

              // Delete Routes
    module.exports.destroyListing = async (req,res)=>{
      let {id} = req.params;
      deleteListing = await Listing.findByIdAndDelete(id);
      console.log(deleteListing);
      req.flash("success", "Listing Deleted !")   // flash  msg
      res.redirect("/listings");
    };

