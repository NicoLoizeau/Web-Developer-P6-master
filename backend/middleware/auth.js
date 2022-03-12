const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = res.body.token;
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'requète non authentifiée' });
    }
}