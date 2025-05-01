
let mongoose = require("mongoose");
let {MONGODB_URL} = require(".");

let connectDB = async() => {
    mongoose.connect(MONGODB_URL);
    console.log(MONGODB_URL)
    console.log("MongoDB Connected");
};

module.exports =  connectDB;

