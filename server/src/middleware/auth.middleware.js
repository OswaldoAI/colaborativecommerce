import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            // Allow hierarchy: SUPERADMIN > ADMIN > USER
            if (req.user.role === 'SUPERADMIN') return next();

            return res.status(403).json({ message: 'Requires ' + role + ' role' });
        }
        next();
    };
};
