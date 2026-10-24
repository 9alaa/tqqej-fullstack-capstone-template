const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const gifts = await db.collection('gifts').find({}).toArray();
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const gift = await db.collection('gifts').findOne({ id: req.params.id });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    res.json(gift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('gifts').insertOne(req.body);
    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
