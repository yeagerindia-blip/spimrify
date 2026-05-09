import User from "../userSchema/userSchema.js";
import jwt from "jsonwebtoken"; // 1. JWT import karein

export const otp_verified = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existEmail = await User.findOne({ email });

        if (!existEmail) {
            return res.status(400).json({ message: "Email not exist" });
        }

        if (String(existEmail.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // OTP Verify ho gaya
        existEmail.isVerified = true;
        existEmail.otp = null;
        await existEmail.save();

        // 2. Token Generate karein (expires in 1 day)
        const token = jwt.sign(
            { id: existEmail._id }, 
            process.env.JWT_SECRET || "your_secret_key", // Apne .env mein JWT_SECRET zaroor rakhein
            { expiresIn: "1d" }
        );

        // 3. Cookie set karein (Ye deployment ke liye perfect settings hain)
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
            sameSite: "none", // Deployment par zaroori hai
            secure: true,     // Deployment (HTTPS) par zaroori hai
        });

        // 4. Response bhein
        return res.status(200).json({
            message: "Account verify",
            isVerified: true,
            userName: existEmail.userName,
            email: existEmail.email,
            role: existEmail.role,
            token: token // Frontend agar localStorage use karna chahe toh backup ke liye
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Account verify Error", error });
    }
};