const express = require('express');
const app = express();

let topMovies = [
    {
      title: 'Psycho',
      director: 'Alfred Hitchcock'
    },
    {
      title: '2001: A Space Odyssey',
      author: 'Stanley Kubrick'
    },
    {
      title: 'Schindler\'s List',
      author: 'Steven Spielberg'
    },
    {
      title: 'Taxi Driver',
      author: 'Martin Scorsese'
    },
    {
      title: 'Apocalypse Now',
      author: 'Francis Ford Coppola'
    },
    {
      title: 'Citizen Kane',
      author: 'Orson Welles'
    },
    {
      title: 'Lawrence of Arabia',
      author: 'David Lean'
    },
    {
      title: 'On the Waterfront',
      author: 'Elia Kazan'
    },
    {
      title: 'It\'s a Wonderful Life',
      author: 'Frank Capra'
    },
    {
      title: 'The Quiet Man',
      author: 'John Ford'
    }
  ];
  
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
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
    
