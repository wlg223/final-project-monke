const express = require('express');
const passport = require('passport');
const Pokedex = require('pokedex-promise-v2');
const router = express.Router();

/* GET pokemon page. */
router.get('/', function(req, res, next) {
    let user = "";
    if(loggedin){
        user = req.session.passport.user
    }
  res.render('pokedex', { title: 'Pokemon Page', loggedin: loggedin, username: user });
});

// new pokedex object for API calls
const pokedex = new Pokedex();

//helper function to make a new pokemon object
function newPokemon(name, dex_no, type, sprite, abilities){
    const pokemon = {
        "name": name,
        "dex_no": dex_no,
        "types": type,
        "sprite": sprite,
        "abilities": abilities
    };
    return pokemon;
}

// helper function for API calls
global.generatePokemon = async function generatePokemon(pokemon_id){
    return await pokedex.getPokemonByName(pokemon_id)
        .then(function(response) {
            // there may be more than one ability and type
            let abilities = response.abilities.map((ability) => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)).join(', ');
            let types = response.types.map((types) => types.type.name.charAt(0).toUpperCase() + types.type.name.slice(1)).join(', ');
            let name = response.name.charAt(0).toUpperCase() + response.name.slice(1);
            // construct pokemon JSON object to send back
            return newPokemon(name, response.id, types, response.sprites.front_default, abilities);
        })
        .catch(function(error) {
            return null
        });
};

// route to get a single pokemon based on their name or dex_number
router.get('/:id', async function(req, res){
    // get the id from the request parameters
    let pokemon_id = req.params.id.toLowerCase();
    let pokemon = await generatePokemon(pokemon_id);
    if(pokemon === null){
        res.status(404).send({status:"error", message:"Pokemon " + pokemon_id + " not found"});
    }else {
        res.status(200).send({status: "ok", pokemon: pokemon});
    }
});

module.exports = router;