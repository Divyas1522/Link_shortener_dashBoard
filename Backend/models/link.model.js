const {Schema , model, default: mongoose} = require("mongoose");   

const linkSchema = new Schema({
    userId:{
        type:String,
    },
    originalUrl:{
        type:String,
        required:true,
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true,
    },
    customAlias:{
        type:String,
        sparse: true,
        unique:true
    },
    clicks:{
        type:Number,
        default:0,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    expireAt:{
        type:Date,
    },
},
    {
        timestamps: true,
    }
);

module.exports = model("Link", linkSchema); // Link is the name of the collection in the database