const Listing=require("./models/listing")
const Review=require("./models/review")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
module.exports.isLoggedIn = (req,res, next) => {
    if (!req.isAuthenticated()) {
      // console.log(req.originalUrl)          for my understanding actually for debugging
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must Login first");
        return res.redirect("/login");
      }
      next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isowner = async (req,res,next) => {
    let { id } = req.params ;
    let listing = await Listing.findById(id);
    console.log(listing.owner._id,res.locals.currUser._id);
    if (!res.locals.currUser._id.equals(listing.owner._id)) { 
      req.flash("error","you are not the owner/Authorized to edit ");
      return res.redirect(`/listing/${id}`);
    }
    next();
  }
  module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
     
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
     }else{
        next();
     }
  }
  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
     
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
     }else{
        next();
     }
  }
  module.exports.isReviewOwner = async (req,res,next) => {
    let { id , reviewId} = req.params;
    const review = await Review.findById(reviewId);
    console.log("locals",res.locals.currUser._id);
    if (!res.locals.currUser._id.equals(review.author._id)) {
      req.flash("error","You are not the owner of this Review !!!");
      return res.redirect(`/listing/${id}`)
    }
    next();
  }
  