const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config")


exports.authMiddleware = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]; // Check for token in cookies or authorization header

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized or Auth token missing" });
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        console.log(decoded);
        next(); // Proceed to the next middleware or route handler
    }
    catch(err){
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

