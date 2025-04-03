require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authJwtController = require('./auth_jwt');
const User = require('./Users');
const Movie = require('./Movies');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({
      success: false,
      msg: 'Please include name, username, and password to signup.'
    });
  }

  try {
    const newUser = new User({ name, username, password });
    await newUser.save();
    res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ success: false, msg: 'Username already exists.' });
    } else {
      console.error(err);
      res.status(500).json({ success: false, msg: 'Error creating user.' });
    }
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }

    const userToken = { id: user._id, username: user.username };
    const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, token: 'JWT ' + token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Error during authentication.' });
  }
});

// ============================
// MOVIE ROUTES (CRUD)
// ============================

// CREATE MOVIE
router.post('/movies', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ success: true, msg: 'Movie created.', movie });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Error creating movie.', error: err.message });
  }
});

// GET ALL MOVIES
router.get('/movies', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to fetch movies.' });
  }
});

// UPDATE MOVIE BY TITLE
router.put('/movies/:title', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { title: req.params.title },
      req.body,
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ success: false, msg: 'Movie not found.' });
    }
    res.status(200).json({ success: true, msg: 'Movie updated.', movie });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to update movie.' });
  }
});

// DELETE MOVIE BY TITLE
router.delete('/movies/:title', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const result = await Movie.deleteOne({ title: req.params.title });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, msg: 'Movie not found.' });
    }
    res.status(200).json({ success: true, msg: 'Movie deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to delete movie.' });
  }
});

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

