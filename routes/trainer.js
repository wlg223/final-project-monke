const express = require('express');
const Trainer = require('../models/Trainer.js');
const router = express.Router();
const min_dexno = 1; // first bulbasaur dex number
const max_dexno = 898; // last pokemon in pokedex

/* GET profile/trainer page. */
router.get('/', async function(req, res, next) {
    let user = "";
    if(loggedin){
        user = req.session.passport.user
    }
    var trainer = await Trainer.findOne({"username": req.session.passport.user}).select(["-_id"]);
    res.render('profile', { title: 'Trainer Page' , loggedin: loggedin, username: user, pokemon: trainer.pokemon, trainer: trainer});
});

//helper function to find and increment the id for a new user
global.newTrainerID = async function newTrainerID(){
    // await the return of DB query to find the latest ID
	let item = await Trainer.find({});
    let newID = 0;
    // check if new ID in array 
    while(item.find(item => item.trainerID === newID) !== undefined){
        // if it already exists due to some put request, just increment
        newID++;
    }
    return newID;
};

// helper function to make a new trainer Object
global.newTrainer = function newTrainer(trainerID, username){
    let date = new Date();
    const trainer = {
                    "trainerID": trainerID,
                    "username": username,
                    "dex_progress": 0,
                    "join_date": date
                  };
    return trainer;
};

// helper function to send a generic response
function generateResponse(status, message){
    return { status: status, message: message };
}


/* GET URL Path /trainers/ returns the logged in users' profile */
router.get('/', async function(req, res) {
    let trainer_name = req.session.passport.user;
    var trainer = await Trainer.findOne({"username": trainer_name}).select(["-_id"]);
    res.status(200).send({status:"ok", trainer: trainer})
});


/* GET route to return everything about the user selected*/
router.get('/:name', async function(req, res){
    // get the trainer name from the req params
    let trainer_name = req.params.name;
    // pull them up from the database
    var trainer = await Trainer.findOne({"username": trainer_name}).select(["-_id"]);
    if(trainer === null){
        res.status(404).send(generateResponse("error", "Cannot find trainer: " + trainer_name));
    }else {
        res.render('profile', { title: 'Trainer Page' , loggedin: loggedin, username: req.session.passport.user, pokemon: trainer.pokemon, trainer: trainer});
    }
});

/* GET route to generate a new pokemon for the user*/
router.post('/catch', async function(req, res){
    var caught = false;
    //grab the trainer name from the request parameters
    let trainer_name = req.session.passport.user;
    // pull them up from the database
    var trainer = await Trainer.findOne({"username": trainer_name});
    // if the result is empty, send an error
    if(trainer === null){
        res.status(404).send(generateResponse("error", "Cannot find trainer: " + trainer_name));
    }else {
        // if everything looks good, proceed to make a new pokemon object
        let pokedex_number = Math.floor(Math.random() * (max_dexno - min_dexno + 1) + min_dexno);
        var new_pokemon = await generatePokemon(pokedex_number);
        new_pokemon.catch_date = new Date();
        // check if the pokemon is a duplicate
        for (let caught_pokemon of trainer.pokemon) {
            if (caught_pokemon.length === 0) {
                break;
            }
            // i dont know why this works but it does. do not flip the logical comparison to make sense.
            if (caught_pokemon.dex_no === new_pokemon.dex_no) {
                caught = true;
            }
        }
        if (caught) {
            res.status(200).send({status: "duplicate", pokemon: new_pokemon});
        } else {
            // attempt to insert into pokemon array
            let result = await Trainer.updateOne({"username": trainer_name}, {
                $push: {"pokemon": new_pokemon},
                $inc: {"dex_progress": 1}
            });
            if (result.nModified === 1) {
                res.status(201).send({status: "ok", pokemon: new_pokemon});
            } else {
                res.status(500).send(generateResponse("error", "Error Adding pokemon to trainer: " + trainer_name));
            }
        }
    }
});

module.exports = router;
