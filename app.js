const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

// database setup
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connect to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


// requirements middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




// test route
app.get("/", (req, res) => {
    res.send("hi am ok");
});

const validateListing = (req, res, next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    }

    next();
};


// to show all the titles of places
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index", { allListings });
}));

// to create a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});


// create new Listing
app.post("/listings",  wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));



// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim(); 
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });

}));

//  update route
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));



//  to see a particular listing in detail
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });

}));


// DELETE ROUTR

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Reviews
// post

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);


})); 

// delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


app.get("/listing/routes/found", (req, res)=>{
    // res.send("the listings are working properly");
    res.render("listings/new.ejs");
});

// app.get("/err", (req, res)=>{
//     res.send("working");
// });

app.all("/*splat", (req, res, next)=>{
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next)=>{
    let{statusCode= 500, message= "something went wrong"}= err;
    res.render("error.ejs", {err});
    
      
});



// port call
app.listen(8080, () => {
    console.log("server is listening on the port 8080");

});




