const jwt = require('jsonwebtoken')
const config = require('config')

const verifyToken = async (req, res, next) => {
    console.log(req.body)
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }

        req.user = jwt.verify(token, config.get("jwtSecret"));
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;