const mongoose = require("mongoose");
const initData = require("./data");
const Listings = require("../models/listing");

MONGO_URL = "mongodb://127.0.0.1:27017/safarsathi";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error:",err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listings.deleteMany();
    await Listings.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
