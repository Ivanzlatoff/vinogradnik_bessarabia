const Order = require('../models/Order');
const { errorHandlerMiddleware } = require('./errorHandler');
const { verifyAccessTokenAndAuthorization, verifyAccessTokenAndAdmin } = require('./verifyToken');
   
const router = require('express').Router();

// CREATE
router.post('/', async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch(err) {
        res.status(500).json(err)
        return
    }
});

// UPDATE
router.put('/:id', verifyAccessTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, 
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch(err){res.status(500).json(err)}
});

// DELETE
router.delete('/:id', verifyAccessTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted...');
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get('/find/:userId', verifyAccessTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
});

// GET ALL
router.get('/', verifyAccessTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err)
    }
});

// GET MONTHLY INCOME
router.get('/income', verifyAccessTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-2));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
                products: { $elemMatch: { productId } },
            }) } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount',
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' }
                },
            },
        ]);

        let sortedIncome = (income.sort((a, b) => a._id - b._id));
        res.status(200).json(sortedIncome);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.use(errorHandlerMiddleware);


module.exports = router