import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user : {
        id : mongoose.Types.ObjectId,
        ref : "User",
        required : true,
    },
    product : {
        id : mongoose.Types.ObjectId,
        ref : "Product",
        required : true,
    },
    rating : {
        type : Number,
        required : true,
    },
    data : {
        commnet : {
            type : String,
            required : true
        },
        images : {
            type : [String],
            default : []
        }
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedAt : {
        type : Date,
        default : Date.now,
    },
})