import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
dotenv.config();


export const protectedRoute = async(req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if(!token) {
            return res.status(401).json({ error: 'Unauthorized: No Token Provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
        };
        const user = await User.findOne({ _id: decoded.userId });
        if(!user) return res.status(401).json({ error: 'User Not Found' });
        
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', error });
    }
}