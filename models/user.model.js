const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        lowercase: true,
        trim: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    phone: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Non-binary", "Other"],
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userRole: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
