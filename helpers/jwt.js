const jwt = require('jsonwebtoken');
const secretKey = "secretKey"

const signToken = (payload) => {
    return jwt.sign(payload, secretKey);
} 

const verifyToken = (token) => {
    return jwt.verify(token, secretKey, { expiresIn: '12h' })
}

module.exports = { signToken, verifyToken }