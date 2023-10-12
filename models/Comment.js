import mongoose from "mongoose";

const CommentsSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    imageUrl: String,
}, {
    timestamps: true
})

export default mongoose.model('Comments', CommentsSchema)