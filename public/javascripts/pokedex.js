//Run once broswer has loaded everything
// window.onload = function () {
    // add click event to the search button
    document.getElementById("pokedex-search-submit")
        .addEventListener("click", getPokemon,false);

    // pressing 'enter' inside the input field will click the search button also
    document.getElementById("pokedex-searchbar")
        .addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("pokedex-search-submit").click();
        }
    });
    console.log("loaded the pokedex window")
// };



function getPokemon(){
    let pokemonID = document.getElementById("pokedex-search").value;
    fetch('/pokemon/' + pokemonID, {
        method:"GET",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'}
    })
        .then(result => result.json())
        .then(async function(result) {
            if (result.status === "error") {
                alert(result.message);
            } else {
                displayPokemon(result.pokemon);
            }
        });
}

function displayPokemon(pokemon){  //function displays pokemon
    document.getElementById("pokemoncard-name").innerHTML = pokemon.name;
    document.getElementById("pokemoncard-sprite").src = pokemon.sprite;
    document.getElementById("pokemoncard-dexno").innerHTML = pokemon.dex_no;
    document.getElementById("pokemoncard-types").innerHTML = pokemon.types;
    document.getElementById("pokemoncard-abilities").innerHTML = pokemon.abilities;
}

