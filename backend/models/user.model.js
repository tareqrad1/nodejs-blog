import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: "",
    },
    backgroundPhoto: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    links: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    likedPost: [{ //here we are get post id i'm liked it 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: "",
    },
    verificationCodeExpires: {
        type: Date,
        default: Date.now,
    },
    resetToken:{
        type: String,
        default: "",
    },
    resetTokenExpires: {
        type: Date,
        default: Date.now,
    },
    accountVerification: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

export default User;