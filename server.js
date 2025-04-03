require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authJwtController = require('./auth_jwt');
const User = require('./Users');
const Movie = require('./Movies');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please include name, username, and password to signup.',
    });
  }

  try {
    const user = new User({ name, username, password });
    await user.save();
    return res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Username already exists.' });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// Signin Route
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const userToken = { id: user._id, username: user.username };
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });
      return res.json({ success: true, token: 'JWT ' + token });
    } else {
      return res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// Protected Movies Route
router.route('/movies')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    return res.status(501).json({ success: false, message: 'GET movies not implemented yet.' });
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    return res.status(501).json({ success: false, message: 'POST movies not implemented yet.' });
  });

app.use('/', router);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
