import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    paragraph: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;