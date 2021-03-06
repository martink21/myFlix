const mongoose = require('mongoose');
const Models = require('./models.js');

const { Movie, User, Genre, Director } = Models;

/* mongoose.connect('mongodb://localhost:27017/myFlixDB', 
{ useNewUrlParser: true, useUnifiedTopology: true }); */
mongoose.connect( process.env.CONNECTION_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
require('./passport');

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

require('./auth')(app);

app.use(morgan('common'));



// const cors = require('cors');
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

const { check, validationResult } = require('express-validator'); 

  // GET requests

  app.get('/', (req, res) => {
    res.send('Welcome!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  // Get a list of all movies
  app.get('/movies', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Movie.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

   // Get a list of user's favorite movies
   app.get('/users/:Username/movies', passport.authenticate('jwt', { session: false }), 
   (req, res) => {
     User.findOne( { Username: req.params.Username } )
       .then((user) => {
         res.status(200).json(user.FavoriteMovies);
       })
       .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
       });
   });

 /** @function
 * @name getMovieByTitle
 * @description Return data about a movie genre by ID
 * @param {string} id - The genre's ID
 * @returns {json} genreQueried - Single movie genre from database
 */
  app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });    
  });

 /** @function
 * @name getMovieById
 * @description Return data about a movie genre by ID
 * @param {string} id - The genre's ID
 * @returns {json} genreQueried - Single movie genre from database
 */

  app.get('/movies/id/:Id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movie.findById(req.params.Id)
    .then((movie) => {
      res.status(200).json(movie);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });    
  });

  /** @function
 * @name getGenre
 * @description Return data about a movie genre by ID
 * @param {string} id - The genre's ID
 * @returns {json} genreQueried - Single movie genre from database
 */

  app.get('/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genre.findOne({Name: req.params.Name})
    .then((genre) => {
      res.status(200).json(genre.Description)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    })
  });

  // Get director info by director name
  app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Director.findOne({Name: req.params.Name})
    .then((director) => {
      res.status(200).json(director)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    })
  });

  // GET all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // Register a new user
  app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = User.hashPassword(req.body.Password);
    User.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          User
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

 // Edit a user
  app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate(
      {Username: req.params.Username},
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
});
  
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
  
  // Remove movies from favorites
  app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });
  
  // Delete users
  app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOneAndRemove( {Username: req.params.Username} )
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + " was not found")
      } else {
        res.status(200).send(req.params.Username + " was deleted")
      }       
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });
  
  //Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Listen for requests
  const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
    
