const NewsletterEmail = require('../models/NewsletterEmail');

const router = require('express').Router();

// CREATE
router.post('/', async (req, res) => {
    const newNewsletterEmail = new NewsletterEmail(req.body);
    try {
        const savedNewsletterEmail = await newNewsletterEmail.save();
        res.status(200).json(savedNewsletterEmail);
    } catch(err) {
        res.status(500).json(err)
    }
});

module.exports = router