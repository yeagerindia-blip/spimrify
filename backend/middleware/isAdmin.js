// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
    // Check karo ki kya user admin hai (isAuth se req.user pehle hi mil chuka hoga)
    if (req.user && req.user.role === 'admin') {
        next(); // Agar admin hai toh aage badhne do
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "Access Denied: Sirf Admin hi ye kar sakta hai!" 
        });
    }
};