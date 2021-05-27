const express = require('express');
const app = express(),
    morgan = require('morgan');

let users = [];
let topMovies = [
    {
      title: 'Psycho',
      director: 'Alfred Hitchcock'
    },
    {
      title: '2001: A Space Odyssey',
      director: 'Stanley Kubrick'
    },
    {
      title: 'Schindler\'s List',
      director: 'Steven Spielberg'
    },
    {
      title: 'Taxi Driver',
      director: 'Martin Scorsese'
    },
    {
      title: 'Apocalypse Now',
      director: 'Francis Ford Coppola'
    },
    {
      title: 'Citizen Kane',
      director: 'Orson Welles'
    },
    {
      title: 'Lawrence of Arabia',
      director: 'David Lean'
    },
    {
      title: 'On the Waterfront',
      director: 'Elia Kazan'
    },
    {
      title: 'It\'s a Wonderful Life',
      director: 'Frank Capra'
    },
    {
      title: 'The Quiet Man',
      director: 'John Ford'
    }
  ];
  
  app.use(morgan('common'));

  
  // GET requests

  app.get('/', (req, res) => {
    res.send('Add /movies to the address above to get the top 10 best movies of all time and their directors!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find((movie) =>
      { return movie.title === req.params.title }));
  });

  // please note the genres of the movies are not yet included 
  // the below is just for the purposes of the exercise
  // genres will be included in the external database 
  app.get('/movies/:title/:genre', (req, res) => {
    res.send('JSON object containing the title and the genre of the movie');
  });

  // please not the bio of the directors are not yet included
  // the below is just for the purposes of the exercise
  // bios will be included in the external database 
  app.get('/movies/:title/:director', (req, res) => {
    res.json("JSON object containing the name of the director and his bio");
  });

  // register a new user
  app.post('/users/register', (req, res) => {
    let newUser = req.body;
  
    if (!newUser.name) {
      const message = 'Missing name in request body';
      res.status(400).send(message);
    } else {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser);
    }
  });

  // edit the details of a user
  // example only
  app.put('/users/edit/:name', (req, res) => {
    res.send('JSON object with the new details of a user')
  });
  
  // add movies to favourites
  // example only
  app.post('/users/:name/favourites', (req, res) => {
    res.send('JSON object containing movies to be added to favourites')
  });
  
  // delete movies from favourites
  // example only
  app.delete('/users/:name/favourites', (req, res) => {
    res.send('JSON object containing movies to be removed from favourites') 
  });
  
  // delete users
  // example only
  app.delete('users/:name', (req, res) => {
    res.send('Message for successfull deregistering of a user')
  });  
  
  //Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
    
