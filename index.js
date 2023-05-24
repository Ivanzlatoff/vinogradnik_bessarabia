const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const wishlistRoute = require('./routes/wishlist');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');
const newsletterRoute = require('./routes/newsletterEmail');
const notificationRoute = require('./routes/notification');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connection Successfull!'))
    .catch((err) => {
        console.log(err);
    });

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cookieSession({
        name: "vb-session",
        secret: process.env.COOKIE_SECRET,
        httpOnly: true
    })
);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/wishlists', wishlistRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);
app.use('/api/newsletter', newsletterRoute);
app.use('/api/notifications', notificationRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Backend server is running on port ' + port);
})
