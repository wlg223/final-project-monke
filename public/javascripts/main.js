//Run once broswer has loaded everything
window.onload = function () {

//button event for "catch a pokemon"
document.getElementById("catch")
    .addEventListener("click", catchPokemon,false);

};

// Function to call fetch on pokemon and add to DB based on trainer name
function catchPokemon(){
    // send a GET request
    fetch('/trainers/catch', {
        method:"POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'}
    })
    .then(response => response.json())
    // Handle the response
    .then(function(res){
        //Error - error occurred adding pokemon to pokedex
        if(res.status === "error"){
          alert("Error adding pokemon: " + res.message);
        }
        //Duplicate - duplicate pokemon, nothing occured
        else if(res.status === "duplicate"){
            document.getElementById("pokemodal-title").innerHTML = "Oh No! You already have this Pokemon.";
            document.getElementById("pokemoncard-close").innerHTML = "Release";
            displayPokemon(res.pokemon);
            $("#pokemodal").modal('show');
        }
        //OK - new pokemon added to dex, display modal
        else if(res.status === "ok"){
           //res.pokemon is the new pokemon object
            document.getElementById("pokemodal-title").innerHTML = "... and Gotcha!";
            displayPokemon(res.pokemon);
            $("#pokemodal").modal('show');
        } 
    })
    // Handle any errors
    .catch((error) => {
        console.error(error);
    });
}

function displayPokemon(pokemon){  //function displays pokemon
    document.getElementById("pokemoncard-name").innerHTML = pokemon.name;
    document.getElementById("pokemoncard-sprite").src = pokemon.sprite;
    document.getElementById("pokemoncard-dexno").innerHTML = pokemon.dex_no;
    document.getElementById("pokemoncard-types").innerHTML = pokemon.types;
    document.getElementById("pokemoncard-abilities").innerHTML = pokemon.abilities;
}
