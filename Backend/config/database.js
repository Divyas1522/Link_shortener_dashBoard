let mongoose = require("mongoose");
let {MONGODB_URL} = require(".");

let connectDB = async() => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log(MONGODB_URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

module.exports =  connectDB;

