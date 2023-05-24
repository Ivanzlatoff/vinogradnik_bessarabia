const router = require('express').Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const NewsletterEmail = require('../models/NewsletterEmail');
const CryptoJS = require('crypto-js');
const { verifyAccessToken, verifyRefreshToken } = require('./verifyToken');
const { generateAccessToken, generateRefreshToken } = require('./tokens');
const { errorHandlerMiddleware } = require('./errorHandler');


// REGISTER
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username) throw new Error('Please enter your username!');
        if (!email) throw new Error('Please enter your email!');
        if (!password) throw new Error('Please enter your password!');
    } catch(err) {
        return next(err)
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({
        username: req.body.username
    });
    
    try {
        if (existingUsername) throw new Error(`Username ${existingUsername.username} already exists! Please try another or login`);
    } catch(err) {
        return next(err)
    }
    
    // Check if email already exists
    const existingEmail = await User.findOne({
        email: req.body.email
    })
    try {
        if (existingEmail) throw new Error(`Email ${existingEmail.email} already exists! Please try another or login`);
    } catch(err) {
        return next(err)
    }
    
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
            ).toString(),
        });
        
        try {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser)
        } catch(err){
            return res.status(500).json(err);
        }
        
});
    
    
// LOGIN
router.post('/login', async (req, res, next) => {

    try {
        if (!req.body.username) throw new Error('Please enter your username!');
        if (!req.body.password) throw new Error('Please enter your password!');

        const user = await User.findOne({
            username: req.body.username
        });
        if (!user) {
            const error = new Error('Username does not exist');
            error.status = 401;
            throw error
        } else {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password, process.env.PASS_SEC
            );
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
                
            if (originalPassword !== req.body.password) {
                const error = new Error('Incorrect Password');
                error.status = 401;
                throw error;
            } 

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            const newRefreshToken = new RefreshToken({
                userId: user._id,
                refreshToken
            });

            try {
                const savedRefreshToken = await newRefreshToken.save();
                const refreshTokenId = savedRefreshToken._doc._id
                const { password, ...others } = user._doc;
                res.status(200).json({...others, accessToken, refreshToken, refreshTokenId });
            } catch(err) {
                return res.status(500).json(err)
            }

        }

    } catch(err) {
        return next(err);
    }
});

// REFRESH TOKEN
router.put('/refresh_token', verifyRefreshToken, async (req, res) => {

    const user = req.user;
    const refreshTokenId = req.body.refreshTokenId;
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    try {
        const updatedRefreshToken = await RefreshToken.findByIdAndUpdate(
            refreshTokenId,
            {
                $set: {
                    userId: user.id,
                    refreshToken: newRefreshToken
                }
            },
            { new: true },
        );
        res.status(200).json({newAccessToken, refreshToken: updatedRefreshToken.refreshToken});
    } catch(err) {
        res.status(500).json(err)
    }
});


// LOGOUT
router.delete('/logout', async (req, res) => {
    try {
        await RefreshToken.findByIdAndDelete(req.body.refreshTokenId);
    } catch(err) {
        res.status(500).json(err);
    }

    try {
        if (req.session) {
            req.session = null;
            res.send('Logout successful')
        } else {
            res.send('Logged out').end();
        }
    } catch(err) {
        console.log(err)
    }
});

router.get('/logout_get', (req, res) => {
    res.cookie('jwt', '', { masAge: 1 })
    res.redirect('/');
});

router.post('/logout_post', verifyAccessToken, async (req, res) => {

    try {
        await RefreshToken.findByIdAndDelete(req.body.refreshTokenId);
        res.status(200).json('You logged out successfully.')
    } catch(err) {
        res.status(500).json(err);
        return 
    }
});

// SIGN UP FOR NEWSLETTER
router.post('/signupfornews', async (req, res) => {
    // Check if email already exists
    const existingEmail = await NewsletterEmail.findOne({
        email: req.body.email
    })
    if (existingEmail) {
        console.warn(`Email ${existingEmail.email} already exists! Please try another`)
        return
    }

    const newNewsletterEmail = new NewsletterEmail({
        email: req.body.email,
    });

    try {
        const savedNewsletterEmail = await newNewsletterEmail.save();
        res.status(201).json(savedNewsletterEmail)
    } catch(err){
        res.status(500).json(err)
    }

});

router.use(errorHandlerMiddleware)


module.exports = router