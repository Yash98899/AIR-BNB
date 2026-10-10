const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");



const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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



app.use("/listings", listing)
app.use("/listings/:id/reviews", reviews)


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




