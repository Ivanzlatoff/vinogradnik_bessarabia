const router = require('express').Router();
const Stripe = require('stripe');
const stripe_key = process.env.STRIPE_KEY
const stripe = Stripe(stripe_key);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgrid_api_key);


const sendEmail = async (to, subject, text) => {
    const msg = {
        to,
        from: 'ivanzlatov@hotmail.com',
        subject,
        text,
    };
    
    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch(err) {
        console.error(`Error sending email: ${err}`);
    }
};


router.post('/payment', async (req, res) => {
    const { tokenId, amount, email, cart } = req.body;

    const productDetails = cart.products.map(({ title, color, price, quantity }) => {
        return (
            `Продукт: ${title} ${color}
            Кількість: ${quantity}
            Ціна за 100 кг: ${price}
            Усього за товар: ${quantity * price}
            `
        )
    })

    const textMessage = `
        Привіт,
    
        Дякуємо за ваше замовлення в нашому магазині. Ми раді повідомити, що ваше замовлення успішно отримано і готується до відправки.
    
        Деталі вашого замовлення наведені нижче:
    
        Товари:
        
        ${productDetails}
    
        Усього разом: ${cart.totalPrice} грн.
    
        Ми надішлемо ваше замовлення в найближчий час. Якщо ви маєте будь-які питання або побажання, будь ласка, зв'яжіться з нами за допомогою електронної пошти або телефону, зазначених на нашому веб-сайті.
    
        Дякуємо, що обрали наш магазин.
    
        З повагою,
        Команда магазину.
    `
    stripe.charges.create({
        source: tokenId,
        amount: amount,
        currency: 'uah',
        receipt_email: email,
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json(stripeErr)
        } else {
            res.status(200).json(stripeRes);
            sendEmail(email, 'Підтвердження замовлення', textMessage);
        }
    });
});


module.exports = router;