
// Variables for the search button and input text
let searchBTNEl = document.querySelector('#searchBTN')
let inputText = document.querySelector('#input')

// Run if ready
$(document).ready(function () {
    // Event Handler for the Search Button
    $('#searchBTN').on('click ', search);

    // Event Handler for Enter key in the input field
    $('#input').on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    })

    // Depending on the layout, there might be need for tab-switcher or second group of event handler

    // Function to call functions for fetch, storage and adding the new item
    function search() {
        event.preventDefault();
        let input = inputText.value;
        if (!input) {
            alert('Please type a keyword!')
        } else {
            getInfo(input);
            $('#input').val('');
        };
    }

    // Event Handler for saved searches // if we want them to be shown upon clicking on buttons?
    $(document).on('click', '.history', function (event) {
        let historyEl = $(event.target);
        let history = historyEl.text();
        getInfo(history);
    })

    // Fetch data 
    function getInfo(input) {
        // let APIKey = ''; we need keys here
        let requsetUrl = '{}' + input + // other filters;
        fetch(requsetUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        displayresult(data);
                        saveInfo(data); // data can be replaced by selected objects/elements
                    });
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .catch(function (error) {
                alert('Unable to connect to the server');
            });
    };



    // Display the search result
    function displayresult(data) {

        // Extract relevant information from the API response
        // let something = data.thing;


        // Update the HTML elements with the extracted information
        document.getElementById('#thing').innerHTML = thing;
        // or
        $(`#thing${i}`).html(`${thing}`);
    }


    // Retreive saved searched
    function getHistory() {
        let allThings = JSON.parse(localStorage.getItem('#things')) || [];
        let things = allThings.slice(0, 10);
        
        // Loop through history and display item
        for (thing of things) {
            let thingEl = `<button class='history'>${thing}</button>`;
            document.getElementById('thing').innerHTML += thingEl;
        }
    }
    getHistory();

    // Store searches in local storage, avoiding repetitive names
    function saveSearch(newThing) {
        let things = JSON.parse(localStorage.getItem('#thing')) || [];
        if (things.length >= 10) {
            things.pop();
        }

        let itemExists = false;
        for (thing of things) {
            if (thing.toUpperCase() === newThing.toUpperCase()) {
                itemExists = true;
                break;
            }
        }
        if (!itemExists) {
            things.unshift(newThing);
            localStorage.setItem('#thing', JSON.stringify(things));

            // Dynamically add the new search to the list (if it doesn't alraedy exist)
            let capThing = newThing.charAt(0).toUpperCase() + newThing.slice(1);
            let thingEl = `<button class='history'>${capThing}</button>`;
            document.getElementById('historyList').innerHTML += thingEl;
        }
    }

})