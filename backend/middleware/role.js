export const adminRole = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    };
    if(req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden: User is not an admin' });
    }
}