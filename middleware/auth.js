const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // If there is a token
    try {
        // verify token, takes in token and the secret. This return user object in decoded variable
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // set the user that is in the payload to req.user which will give us access to the user inside the route.
        req.user = decoded.user;

        // call next to move on
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}