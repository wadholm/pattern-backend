const jwt = require('jsonwebtoken');

// Generate an Access Token for the given User ID
function generateAccessToken(userId) {
    const token = jwt.sign(
        {
            userId: userId.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );

    return token;
}

module.exports = {
    generateAccessToken: generateAccessToken
};
