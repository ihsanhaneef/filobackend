// auth.js
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    try {
        const authToken = req.headers.authorization;
        jwt.verify(authToken, "filoi2024");
        next();
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Provide auth token" });
    }
}
