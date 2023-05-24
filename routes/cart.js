const Cart = require('../models/Cart');
const { verifyAccessToken, verifyAccessTokenAndAuthorization, verifyAccessTokenAndAdmin } = require('./verifyToken');
   
const router = require('express').Router();

// CREATE
router.post('/', verifyAccessToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch(err) {
        res.status(500).json(err)
    }
});

// UPDATE
router.put('/:id', verifyAccessTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, 
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch(err){res.status(500).json(err)}
});

router.patch(':/id', verifyAccessTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.updateOne({ 
            _id: req.params.id, 
            [req.query.field]: req.query.value
        });
        res.status(200).json(cart);
    } catch(err){res.status(500).json(err)}
})

// DELETE
router.delete('/:id', verifyAccessTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart has been deleted...');
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET USER CART
router.get('/find/:userId', verifyAccessTokenAndAuthorization, async (req, res) => {
    try{
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET ALL
router.get('/', verifyAccessTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = router