const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function verifyToken(req, res, next) {
     const authHeader = req.headers['authorization'];
     if (!authHeader) return res.status(401).json({ message: 'No token provided' });

     const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

     try {
          const decoded = jwt.verify(token, JWT_SECRET);
          req.user = decoded;
          next();
     } catch (err) {
          return res.status(401).json({ message: 'Invalid or expired token' });
     }
}

router.post('/register', async (req, res) => {
     const { email, password } = req.body;
     const first_name = req.body.first_name || req.body.firstname;
     const last_name = req.body.last_name || req.body.lastname;

     if (!email || !password || !first_name || !last_name) {
          return res.status(400).json({ message: 'All fields are required' });
     }
     try {
          const existing = await pool.query('SELECT user_id FROM tb_users WHERE email = $1', [email]);
          if (existing.rows.length > 0) {
               return res.status(409).json({ message: 'Email already in use' });
          }

          const hashed = await bcrypt.hash(password, 10);
          const result = await pool.query(
               'INSERT INTO tb_users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING user_id, email, first_name, last_name',
               [email, hashed, first_name, last_name]
          );

          res.status(201).json({ user: result.rows[0] });
     } catch (err) {
          console.error('Register error:', err);
          res.status(500).json({ message: 'Server error' });
     }
});

router.post('/login', async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
     }

     try {
          const result = await pool.query('SELECT * FROM tb_users WHERE email = $1', [email]);
          const user = result.rows[0];

          if (!user) return res.status(401).json({ message: 'Invalid credentials' });

          const match = await bcrypt.compare(password, user.password);
          if (!match) return res.status(401).json({ message: 'Invalid credentials' });

          const token = jwt.sign(
               { id: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name },
               JWT_SECRET,
               { expiresIn: '7d' }
          );

          res.json({
               token,
               user: { id: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name },
          });
     } catch (err) {
          console.error('Login error:', err);
          res.status(500).json({ message: 'Server error' });
     }
});

router.post('/logout', (req, res) => {
     res.clearCookie('refreshToken', {
          httpOnly: true,
          sameSite: 'strict',
          secure: false // true when use https
     })

     res.json({ message: 'Logged out' })
})

router.get('/me', verifyToken, (req, res) => {
     res.json({ user: req.user });
});

module.exports = router;
