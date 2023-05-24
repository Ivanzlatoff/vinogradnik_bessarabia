const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        refreshToken: {type: String},
    },
    {timestamps: true}
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);