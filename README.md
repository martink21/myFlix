# myFlix

### Tools:
* Node.js
* Express
* Heroku
* MongoDB
* MongoDB Atlas
* Postman

API URl: https://myflix-21.herokuapp.com/

Documentation URL: https://myflix-21.herokuapp.com/documentation

**How to register a new user (needs no authorization):** Please use https://myflix-21.herokuapp.com/users with POST and include a raw JSON body with the following format:
```
{

    "Username": "yourusername",
    
    "Password": "yourpassword",
    
    "Email": "youremail@email.com",
    
    "Birthday": "YYYY-MM-DD"

}
```

**How to generate a token:** Please use the login endpoint with POST https://dashboard.heroku.com/apps/myflix-21/login to log in with an existing user. When logged in you will receive a token. Please copy-paste it into the authorization tab after you choose type "Bearer Token".


This application provides users with access to information about different
movies, directors, and genres. Users are able to sign up, update their
personal information, and create a list of their favorite movies.

* Essential Features
* Return a list of ALL movies to the user
* Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
* Return data about a genre (description) by name/title (e.g., “Thriller”)
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a movie to their list of favorites
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister
