const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');

/** @constant
 * @name movieSchema
 * @description Movies Mongoose Schema
 */
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
  });
  
  /** @constant
 * @name userSchema
 * @description Users Mongoose Schema
 */
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  /** @function
 * @name hashUserPassword
 * @description Generate hash for the password (auto-gen a salt of 10 and hash)
 * @param {string} password
 * @param {number} - Hashing salt
 */
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  /** @function
 * @name validateUserPassword
 * @description Compare stored hashed password with password entered on client side
 * @param {string} password
 * @returns {string } password, this.password - Return comparison of received passwords
 */
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  /** @constant
 * @name directorSchema
 * @description Directors Mongoose Schema
 */
  let directorSchema = mongoose.Schema({
    Name:{type:String},
    Bio:{type:String},
    BirthYear: Date
});

/** @constant
 * @name genreSchema
 * @description Genres Mongoose Schema
 */
let genreSchema = mongoose.Schema({
    Name: { type:String },
    Description:{ type: String }
});
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  let Genre = mongoose.model ('Genre', genreSchema);
  let Director = mongoose.model ('Director', directorSchema);
  
  module.exports = { Movie, User, Genre, Director}

