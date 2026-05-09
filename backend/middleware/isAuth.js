import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Please login first" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token" 
            });
        }

        // 🟢 SABSE IMPORTANT: Dono set kar do taaki koi confusion na rahe
        req.userId = decoded.userId || decoded.id;
        req.id = decoded.userId || decoded.id; 

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Session expired, login again" 
        });
    }
};

export default isAuth;