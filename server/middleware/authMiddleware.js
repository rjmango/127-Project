import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = (req, res, next) => {
    try {
        const cookie = req.cookies['jwt'];
        
        if (!cookie) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        req.user = claims; // Attach user claims to request object
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authenticate;