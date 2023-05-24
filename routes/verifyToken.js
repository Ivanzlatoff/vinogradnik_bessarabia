const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');


const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const accessToken = authHeader.substring(7);
        
        jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json("Access token is not valid!")
            };
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json('You are not authenticated!')
    }
};

const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken, refreshTokenId } = req.body;

    if (!refreshToken) return res.status(401).json("You are not authenticated!");

    const existingRefreshToken = await RefreshToken.findOne({
        refreshToken: refreshToken
    });
    try {
        if (!existingRefreshToken) throw new Error('Refresh token is invalid!');
    } catch(err) {
        return next(err)
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SEC, async (err, user) => {
        if (err) {
            await RefreshToken.findByIdAndDelete(refreshTokenId)
            res.status(403).json("Refresh token is not valid!")
        };
        req.user = user;
        next();
    })
};

const verifyAccessTokenAndAuthorization = (req, res, next) => {
    verifyAccessToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        } else {
            res.status(403).json('You are not allowed to do that!')
        }
    })
}

const verifyAccessTokenAndAdmin = (req, res, next) => {
    verifyAccessToken(req, res, () => {
        if(req.user.isAdmin){
            next()
        } else {
            res.status(403).json('You are not allowed to do that!')
        }
    })
}

module.exports = { verifyAccessToken, verifyRefreshToken, verifyAccessTokenAndAuthorization, verifyAccessTokenAndAdmin };