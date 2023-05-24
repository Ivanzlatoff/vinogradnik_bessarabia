const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        type: { type: String, required: true, unique: true},
        desc: { type: Object, required: true },
        img: { type: String, required: true },
        categories: { 
            type: [String], 
            required: true,
            validate: v => Array.isArray(v) && v.length > 0, 
        },
        color: {
            type: [String], 
            required: true,
            validate: v => Array.isArray(v) && v.length > 0, 
        },
        price: { type: Number, required: true},
        inStock: { type: Boolean, default: true }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Products', ProductsSchema)