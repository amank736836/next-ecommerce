import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: [true, "Please enter comment"],
        },
        rating: {
            type: Number,
            required: [true, "Please enter rating"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"],
        },
        user: {
            type: String,
            ref: "User",
            required: [true, "Please enter user"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Please enter product"],
        },
    },
    {
        timestamps: true,
    }
);

export const Review = mongoose.models.Review || mongoose.model("Review", schema);
