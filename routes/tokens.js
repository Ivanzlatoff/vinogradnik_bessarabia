const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SEC, {
        expiresIn: '1d'
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_SEC, {
        expiresIn: '7d',
    });
};

const sendAccessToken = (req, res, { ...others }, accessToken) => {
    res.send({...others, accessToken})
};

const sendRefreshToken = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/refresh_token'
    })
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    sendAccessToken,
    sendRefreshToken
}