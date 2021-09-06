const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

  /** @function
 * @name validateUser
 * @description Validate login data between client and server side
 * @param {string} usernameField
 * @param {string} passwordField
 * @returns {string} callback - Message with validation data
 */
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    if (!user.validatePassword(password)) {
        console.log('incorrect password');
        return callback(null, false, {message: 'Incorrect password.'});
      }

    console.log('finished');
    return callback(null, user);
  });
}));

/** @function
 * @name jwtHandler
 * @description Extract JWT from the request
 * @param {object} jwtPayload
 * @param {object} callback
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));