import User from "../userSchema/userSchema.js"
import jwt from "jsonwebtoken"; // 1. JWT import zaroor karein

export const getCurrentUser = async(req, res) => {
    try {
        // 2. Cookie se token nikaalna (Yahi sabse important step hai)
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token, please login" });
        }

        // 3. Token ko verify karke userId nikaalna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Jo id humne otp_verified mein token mein bhari thi

        if (!userId) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // 4. User ko database mein dhoondna
        const user = await User.findById(userId).select("-password -otp");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 5. User data bhej dena (Ab page redirect nahi hoga)
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in getCurrentUser:", error.message);
        return res.status(401).json({ message: "Session expired, login again" });
    }
}