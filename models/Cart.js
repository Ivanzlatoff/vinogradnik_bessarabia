const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true },
        products: [
            {
                _id: {type: String, required: true, unique: true},
                title: {type: String, required: true, unique: true },
                desc: { type: Object, required: true },
                img: {type: String, required: true },
                categories: {type: Array, required: true },
                color: {type: String, required: true },
                price: {type: Number, required: true},
                inStock: { type: Boolean, default: true },
                createdAt: {type: String},
                updatedAt: {type: String},
                type: {type: String},
                quantity: {type: Number, required: true}
            },
        ],
    },
    {timestamps: true}
);

module.exports = mongoose.model('Cart', CartSchema);