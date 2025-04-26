const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./Users');
require('dotenv').config();

const opts = {};
// ✅ CHANGE: Use 'JWT' instead of Bearer
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Find user by username so req.user is attached
      const user = await User.findOne({ username: jwt_payload.username });

      if (user) return done(null, user);
      else return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

exports.isAuthenticated = passport.authenticate('jwt', { session: false });
exports.secret = opts.secretOrKey;

