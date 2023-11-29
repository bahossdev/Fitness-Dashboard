// Variables for the search button and input text
let submitEl = document.querySelector("#submit");
let foodText = document.querySelector(".foodText");
let amountEl = document.querySelector("#amount");
let measureEl = document.getElementById("foodType");
let activityText = document.querySelector(".activityText");
let durationEl = document.getElementById("duration")

// Run if ready
$(document).ready(function () {
  // Event Handler for the food Search Button
  $(".foodForm .submit").on("click", foodSearch);

  // Event Handler for Enter key in the input field
  $(".foodForm" + " #submit").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      foodSearch();
    }
  });

  // Event Handler for the Activity Search Button
  $(".activityForm .submit").on("click", activitySearch);

  // Event Handler for Enter key in the input field
  $(".activityForm" + " #submit").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      activitySearch();
    }
  });

  // Depending on the layout, there might be need for tab-switcher 

  // Function to call functions for fetch, storage and adding the new item
  function foodSearch() {
    event.preventDefault();
    let food = foodText.value;
    let amount = amountEl.value;
    let measure = measureEl.value;

    if (!foodText || !amount || !measureEl) {
      alert("Please type a keyword!");
    } else {
      getFoodInfo(food, amount, measure);
      $(".foodText").val("");
      $("#amount").val("");
    }
  }

  function activitySearch() {
    event.preventDefault();
    let activity = activityText.value;
    let duration = durationEl.value;

    if (!activityText || !durationEl) {
      alert("Please type a keyword!");
    } else {
      getActivityInfo(activity, duration);
      console.log(activity);
      console.log(duration);
      $(".activityText").val("");
      $("#duratiion").val("");
    }
  }

  // Event Handler for saved searches // if we want them to be shown upon clicking on buttons?
  $(document).on("click", ".history", function (event) {
    let historyEl = $(event.target);
    let history = historyEl.text();
    getInfo(history);
  });

  // Fetch data for food search
  function getFoodInfo(food, amount, measure) {
    let APIKey = "b5e2ab46de743f89705388baac3abb12";
    let APIId = "b84dedab";
    console.log(food);
    console.log(amount);
    console.log(measure);

    let requsetUrl =
      "https://api.edamam.com/api/nutrition-data?app_id=" +
      APIId +
      "&app_key=" +
      APIKey +
      "&nutrition-type=cooking&ingr=" +
      amount + '%20' + measure + '%20' + food;

    fetch(requsetUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data.calories);
            console.log(data.totalDaily);
            // displayResult(data);
            // saveInfo(data); // data can be replaced by selected objects/elements
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function (error) {
        alert("Unable to connect to the server");
      });
  }

  // Fetch data for activity search
  function getActivityInfo(activity, duration) {
    let APIKey = "WtIp1I8eoOwneW7Y533fWIk78SoMiG6rEKqV9OJR";
    console.log(activity);
    console.log(duration);
    baseUrl = "https://api.api-ninjas.com/v1/caloriesburned?activity=";
    return fetch(baseUrl + activity + "&duration=" + duration, {
      headers: { "x-api-key": APIKey },
    }).then((response) =>
      response.json().then(function (data) {
        console.log(data);
        // displayResult(data);
        // saveInfo(data); // data can be replaced by selected objects/elements
      })
    );
  }

  // // Display the search result
  // function displayResult(data) {
  //   // Extract relevant information from the API response
  //   // let something = data.thing;

  //   // Update the HTML elements with the extracted information
  //   document.getElementById("#thing").innerHTML = thing;
  //   // or
  //   $(`#thing${i}`).html(`${thing}`);
  // }

  // // Retreive saved searched
  // function getHistory() {
  //   let allThings = JSON.parse(localStorage.getItem("#things")) || [];
  //   let things = allThings.slice(0, 10);

  //   // Loop through history and display item
  //   for (thing of things) {
  //     let thingEl = `<button class='history'>${thing}</button>`;
  //     document.getElementById("thing").innerHTML += thingEl;
  //   }
  // }
  // getHistory();

  // // Store searches in local storage, avoiding repetitive names
  // function saveSearch(newThing) {
  //   let things = JSON.parse(localStorage.getItem("#thing")) || [];
  //   if (things.length >= 10) {
  //     things.pop();
  //   }

  //   let itemExists = false;
  //   for (thing of things) {
  //     if (thing.toUpperCase() === newThing.toUpperCase()) {
  //       itemExists = true;
  //       break;
  //     }
  //   }
  //   if (!itemExists) {
  //     things.unshift(newThing);
  //     localStorage.setItem("#thing", JSON.stringify(things));

  //     // Dynamically add the new search to the list (if it doesn't alraedy exist)
  //     let capThing = newThing.charAt(0).toUpperCase() + newThing.slice(1);
  //     let thingEl = `<button class='history'>${capThing}</button>`;
  //     document.getElementById("historyList").innerHTML += thingEl;
  //   }
  // }
});
