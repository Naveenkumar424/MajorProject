const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

MONGO_URL = "mongodb://127.0.0.1:27017/safarsathi";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error:",err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi ,I am root!");
});


//Index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListinngs = await Listings.find({});
    res.render("./listings/index.ejs",{listings:allListinngs});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const listing = await Listings.findById(req.params.id);
    res.render("./listings/show.ejs",{listing:listing});
}));

//create route
app.post("/listings",wrapAsync(async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    const listing = await Listings.findById(req.params.id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const listing = await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));
 

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listings({
//         title:"My villa",
//         description:"This is a sample listing",
//         price:1000,
//         location:"Delhi",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Listing saved");
//     res.send("Listing saved");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("App listening on port 8080");
});