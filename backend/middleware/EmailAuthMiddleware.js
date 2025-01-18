const jwt = require("jsonwebtoken");

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const EmailAuthMiddleware = async (req, res, next)=>{
    const token = req.headers.token;
    if (!token) {
        res.status(401).json({ msg: "No token provided" });
        return;
    }
    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
        return;
    }
    try {
        const userFound = await User.findOne({ _id: decoded.userId });
        if (!userFound) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Attach user information to request for further use in other routes if needed
        req.authorID = userFound._id;
        req.Txt = userFound.txt;
        next(); // Pass control to the next middleware or route handler
    } catch (e) {
        console.log("Error while getting user details: " + e);
        return res.status(500).json({ msg: "Error while getting user details" });
    }
}

module.exports = EmailAuthMiddleware