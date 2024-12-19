const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
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
