import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // +++++++++++++++++++++++++++++++++++
    payment: [{
        amount: {
            type: Number,
            required: true
        },
        upiId: {
            type: String,
            required: false // Withdrawal ke liye chahiye, deposit ke liye nahi
        },
        transactionId: {
            type: String,
            required: true
        },
        paymentProf: {
            type: String,
            required: false
        },
        status: {
            type: String,
            // 🟢 "Win" ko yahan add kar do taaki purana data error na de
            enum: ["pending", "approved", "rejected", "Win"],
            default: "pending"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ["deposit", "withdrawal", "bonus", "game_win"],
            default: "deposit"
        }
    }],
    // +++++++++++++++++++++++++++++
    otp: {
        type: String,
        required: false,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "user"
    },
    walletBalance: {  // 👈 Ye wali field add karni hai
        type: Number,
        default: 0    // Naya user 0 balance se shuru karega
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User