const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Genre list (inline since `genres` was not declared globally)
const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
];

// Actor Sub-Schema
const ActorSchema = new Schema({
  actorName: { type: String, required: true },
  characterName: { type: String, required: true }
});

// Movie Schema
const MovieSchema = new Schema({
  title: { type: String, required: true, index: true },
  releaseDate: { type: Number, min: 1900, max: 2100 },
  genre: { type: String, enum: genres, required: true },
  actors: [ActorSchema],
  imageUrl: {
    type: String,
    default: 'https://wallpapercave.com/wp/wp5338281.jpg',
    index: true
  }
});

module.exports = mongoose.model('Movie', MovieSchema);

