const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        products: [
            {
                _id: {type: String, required: true, unique: true},
                title: {type: String, required: true, unique: true },
                desc: {type: String, required: true },
                img: {type: String, required: true },
                categories: {type: Array, required: true },
                color: {type: Array, required: true },
                price: {type: Number, required: true},
                inStock: { type: Boolean, default: true },
                createdAt: {type: String},
                updatedAt: {type: String},
                type: {type: String}
            }            
        ]
    }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);