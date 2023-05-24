const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: {type: String, default: 'unregistered' },
        products: [
            {
                productId: {
                    type: String
                },
                title: {
                    type: String
                },
                color: {
                    type: String
                },
                quantity: {
                    type: Number,
                },
                price: {
                    type: Number
                }
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        email: { type: String, required: true },
        status: { type: String, default: 'pending' },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Order', OrderSchema)