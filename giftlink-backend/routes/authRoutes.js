const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await connectToDatabase();
    const users = db.collection('users');
    const existing = await users.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name: name || username || email.split('@')[0],
      username: username || email.split('@')[0],
      email: email.toLowerCase(),
      password: hashedPassword
    };

    await users.insertOne(user);
    res.status(201).json({ message: 'User registered successfully', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({
      email: (email || '').toLowerCase()
    });

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'giftlink-development-secret',
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
