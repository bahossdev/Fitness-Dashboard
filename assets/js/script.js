// Variables for the search button and input text
let submitEl = document.querySelector("#submit");
let foodText = document.querySelector(".foodText");
let amountEl = document.querySelector("#amount");
let measureEl = document.getElementById("foodType");
let activityText = document.querySelector(".activityText");
let durationEl = document.getElementById("duration");
let resultsE1 = document.getElementById("results");

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
      amount +
      "%20" +
      measure +
      "%20" +
      food;

    fetch(requsetUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data.calories);
            console.log(data.totalDaily);
            displayResult_FoodInfo(data);
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

  // Display the search result for Nutrients Info
  function displayResult_FoodInfo(data) {
    // Extract relevant information from the API response
    while (resultsE1.firstChild) {
      resultsE1.removeChild(resultsE1.firstChild);
    }
    if (data.calories) {
      var calories = document.createElement("p");
      calories.textContent = "Calories " + Math.round(data.calories, 2);
      resultsE1.appendChild(calories);
    } else {
      var calories = document.createElement("p");
      satFat.textContent = "Calories  - ";
      resultsE1.appendChild(calories);
    }

    if (data.totalDaily.FASAT) {
      var satFat = document.createElement("p");
      satFat.textContent =
        data.totalDaily.FASAT.label +
        " " +
        Math.round(data.totalDaily.FASAT.quantity, 2) +
        data.totalDaily.FASAT.unit;
      resultsE1.appendChild(satFat);
    } else {
      var satFat = document.createElement("p");
      satFat.textContent = "Saturated  - ";
      resultsE1.appendChild(satFat);
    }
    if (data.totalDaily.FAT) {
      var Fat = document.createElement("p");
      Fat.textContent =
        data.totalDaily.FAT.label +
        " " +
        Math.round(data.totalDaily.FAT.quantity, 2) +
        data.totalDaily.FAT.unit;
      resultsE1.appendChild(Fat);
    } else {
      var Fat = document.createElement("p");
      Fat.textContent = "Fat - ";
      resultsE1.appendChild(Fat);
    }

    if (data.totalDaily.CHOCDF) {
      var carb = document.createElement("p");
      carb.textContent =
        data.totalDaily.CHOCDF.label +
        " " +
        Math.round(data.totalDaily.CHOCDF.quantity, 2) +
        data.totalDaily.CHOCDF.unit;
      resultsE1.appendChild(carb);
    } else {
      var carb = document.createElement("p");
      carb.textContent = "Carbs   -";
      resultsE1.appendChild(carb);
    }
    if (data.totalDaily.PROCNT) {
      var protein = document.createElement("p");
      protein.textContent =
        data.totalDaily.PROCNT.label +
        " " +
        Math.round(data.totalDaily.PROCNT.quantity, 2) +
        data.totalDaily.PROCNT.unit;
      resultsE1.appendChild(protein);
    } else {
      var protein = document.createElement("p");
      protein.textContent = "protein   -";
      resultsE1.appendChild(protein);
    }
    if (data.totalDaily.VITA_RAE) {
      var vitA = document.createElement("p");
      vitA.textContent =
        data.totalDaily.VITA_RAE.label +
        " " +
        Math.round(data.totalDaily.VITA_RAE.quantity, 2) +
        data.totalDaily.VITA_RAE.unit;
      resultsE1.appendChild(vitA);
    } else {
      var vitA = document.createElement("p");
      vitA.textContent = "Vitamin A   - ";
      resultsE1.appendChild(vitA);
    }
    if (data.totalDaily.VITC) {
      var vitC = document.createElement("p");
      vitC.textContent =
        data.totalDaily.VITC.label +
        " " +
        Math.round(data.totalDaily.VITC.quantity, 2) +
        data.totalDaily.VITC.unit;
      resultsE1.appendChild(vitC);
    } else {
      var vitC = document.createElement("p");
      vitC.textContent = "Vitamin C  - ";
      resultsE1.appendChild(vitC);
    }
    if (data.totalDaily.VITD) {
      var vitD = document.createElement("p");
      vitD.textContent =
        data.totalDaily.VITD.label +
        " " +
        Math.round(data.totalDaily.VITD.quantity, 2) +
        data.totalDaily.VITD.unit;
      resultsE1.appendChild(vitD);
    } else {
      var vitD = document.createElement("p");
      vitD.textContent = "Vitamin D -";
      resultsE1.appendChild(vitD);
    }

    if (data.totalDaily.CA) {
      var calcium = document.createElement("p");
      calcium.textContent =
        data.totalDaily.CA.label +
        " " +
        Math.round(data.totalDaily.CA.quantity, 2) +
        data.totalDaily.CA.unit;
      resultsE1.appendChild(calcium);
    } else {
      var calcium = document.createElement("p");
      calcium.textContent = "calcium  -";
      resultsE1.appendChild(calcium);
    }
    if (data.totalDaily.K) {
      var potassium = document.createElement("p");
      potassium.textContent =
        data.totalDaily.K.label +
        " " +
        Math.round(data.totalDaily.K.quantity, 2) +
        data.totalDaily.K.unit;
      resultsE1.appendChild(potassium);
    } else {
      var potassium = document.createElement("p");
      potassium.textContent = "potassium  -";
      resultsE1.appendChild(potassium);
    }
    if (data.totalDaily.FE) {
      var iron = document.createElement("p");
      iron.textContent =
        data.totalDaily.FE.label +
        " " +
        Math.round(data.totalDaily.FE.quantity, 2) +
        data.totalDaily.FE.unit;
      resultsE1.appendChild(iron);
    } else {
      var iron = document.createElement("p");
      iron.textContent = "iron  -";
      resultsE1.appendChild(iron);
    }
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
