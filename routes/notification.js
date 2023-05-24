const Notification = require('../models/Notification');
const { verifyAccessTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

// GET ALL
router.get('/', verifyAccessTokenAndAdmin, async (req, res) => {
  try {
    const since = req.query.since;
    let notifications;
    if (since) {
      notifications = await Notification.find({ createdAt: { $gte: since } });
    } else {
      notifications = await Notification.find();
    }
    res.status(200).json(notifications);
  } catch(err) {
    res.status(500).json(err);
  }
});

// CREATE
router.post('/', async (req, res) => {
    const newNotification = new Notification(req.body);
    try {
        const savedNewNotification = await newNotification.save();
        res.status(200).json(savedNewNotification);
    } catch(err) {
        res.status(500).json(err)
        console.log(err)
    }
});

// UPDATE
router.put('/:id', verifyAccessTokenAndAdmin, async (req, res) => {

    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, 
            { new: true }
        );
        res.status(200).json(updatedNotification);
    } catch(err){res.status(500).json(err)}
});

module.exports = router