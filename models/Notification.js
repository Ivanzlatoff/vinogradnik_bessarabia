const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {   userId: {type: String, default: 'unregistered'},
        username: {type: String, default: 'unregistered'},
        email: {type: String, required: true },
        isAdmin: {type: Boolean, default: false},
        title: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        telephone: {type: String},
        subject: {type: String, required: true},
        message: {type: String, required: true},
        read: {type: Boolean, default: false}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Notification', NotificationSchema)