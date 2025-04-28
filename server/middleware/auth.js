// middlewares/authMiddleware.js
import { verify } from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    try {
        const cookie = req.cookies['jwt'];
        
        if (!cookie) {
            return res.status(401).json({
                message: "unauthenticated"
            });
        }

        // Verify JWT if needed
        const decoded = verify(cookie, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({
            message: "unauthenticated"
        });
    }
};

export default authenticateUser;