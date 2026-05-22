import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    product : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
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
});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;