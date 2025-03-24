const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

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
app.get("/listings",async(req,res)=>{
    const allListinngs = await Listings.find({});
    res.render("./listings/index.ejs",{listings:allListinngs});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id",async(req,res)=>{
    const listing = await Listings.findById(req.params.id);
    res.render("./listings/show.ejs",{listing:listing});
});

//create route
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    const listing = await Listings.findById(req.params.id);
    res.render("listings/edit.ejs",{listing});
});

app.put("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    const listing = await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
});


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

app.listen(8080,()=>{
    console.log("App listening on port 8080");
});