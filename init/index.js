const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/listing.js");

const mongodb_url = "mongodb://127.0.0.1:27017/wanderlust";



main().then((res)=>{
    console.log("its was work");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongodb_url);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const rawData = require("./data");
    const initData = rawData.data.map((obj) => ({
        ...obj,
        owner: "6817ffa894e0a6bd994c5f42"
    }));

    await Listing.insertMany(initData);
    console.log("Data is initialized");
};


initDB();