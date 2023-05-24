const mongoose = require('mongoose');

const NewsletterEmailSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
    },
    {timestamps: true}
);

module.exports = mongoose.model('NewsletterEmail', NewsletterEmailSchema)