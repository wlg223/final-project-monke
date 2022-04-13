# PokéRoll Final Project

## Due Friday, May 7, 2021

### Build a web app in a team of 5-6

## Team name: 
Team monke

### Team members
- Front-end: Sarah Pontier, Jeremy Feng
- Back-end: Wesley Guarneri
- Full-stack: Andrew Ha, Noah Backman

### Functionality:
Users are able to generate and random pokémon by pressing a button. If a user is logged in, pokémon generated will be stored on a list that a user can see on their profile page.

### User story/use case:
Users might want to find a fun and easy way to catch pokemon and want a simple mechanism for doing so by the press of a button. Rather than the traditional method of catching pokemon in other pokemon games, this website provides a simple way of doing so

- The user will first be presented with the main page which will have a “Catch a Pokemon” button at the center of the page
- If the user is logged in, the user’s profile page will include the Pokedex containing a list of pokemon the user has caught so far along with some metrics (name, types) about the Pokémon they’ve caught. 
- User profile page will also include basic info about the user (username)

### Technical Design:
- Will use express.js and node.js for the backend and handle routing
- Use Bootstrap framework for the frontend
- pokeAPI for pokemon data (third-party REST API)
  - Will use pokedex-promise-v2 library to interface with APIs
    - Also provides auto-caching feature to avoid excess API calls
- Passport.js to authenticate users
- A MongoDB database will be used to store and share user data (e.g. pokemon caught by user)
- Will use Heroku to make the app publicly accessible

### Tools/libraries/frameworks you will use:
- Node.js (backend)
- Express.js (routing)
- MongoDB (database)
- Bootstrap (front-end)
- PokeAPI (https://pokeapi.co/)
- Passport.js (authentication)
- Heroku (website deployment)
- pokedex-promise-v2 (Wrapper library for PokeAPI)
  - https://github.com/PokeAPI/pokedex-promise-v2
