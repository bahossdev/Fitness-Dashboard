// Variables for the search button and input text
let submitEl = document.querySelector("#submit");
let foodText = document.querySelector(".foodText");
let amountEl = document.querySelector("#amount");
let measureEl = document.getElementById("foodType");
let weightEl = document.querySelector(".weight");
let heightEl = document.querySelector(".height");
let ageEl = document.getElementById("age");
let genderEl = document.getElementById("gender");
let activityEl = document.getElementById("activity");
let resultsEl = document.getElementById("results");

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

  // Event Handler for the TDEE Search Button
  $(".tdeeForm .submit").on("click", tdeeSearch);

  // Event Handler for Enter key in the input field
  $(".tdeeForm" + " #submit").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      tdeeSearch();
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

  // Function to call functions for fetch, storage and adding the new item
  function foodSearch() {
    event.preventDefault();
    let food = foodText.value;
    let amount = amountEl.value;
    let measure = measureEl.value;

    if (!foodText || !amount || !measureEl) {
      alert("Please fill all mandatory fields!");
    }
    if (isNaN(amount)) {
      alert("Please enter a number!");
    } else {
      getFoodInfo(food, amount, measure);
      $(".foodText").val("");
      $("#amount").val("");
      $("#foodType").val("Choose an option");
    }
  }

  function tdeeSearch() {
    event.preventDefault();
    let weight = weightEl.value;
    let height = heightEl.value;
    let age = ageEl.value;
    let gender = genderEl.value;
    let activityLevel = activityEl.value;

    if (!weight || !height || !age || !gender || !activityLevel) {
      alert("Please fill all mandatory fields!");
    }
    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      alert("Please enter a number!");
    } else {
      getTDEE(weight, height, age, gender, activityLevel);
      console.log(weight);
      console.log(height);
      console.log(age);
      console.log(gender);
      console.log(activityLevel);
      $(".weight").val("");
      $(".height").val("");
      $("#age").val("");
      $("#gender").val("Gender");
      $("#activity").val("Please choose an activity level");

    }
  }

  // Event Handler for saved food searches 
  $(".foodForm .btn").on("click", function () {
    getFoodHistory();
  });


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

  // Fetch data for food search and store to local storage as foodObject
  function getFoodInfo(food, amount, measure) {
    let APIKey = "b5e2ab46de743f89705388baac3abb12";
    let APIId = "b84dedab";

  
      // Fetch for food info
      let requestUrl =
        "https://api.edamam.com/api/nutrition-data?app_id=" +
        APIId +
        "&app_key=" +
        APIKey +
        "&nutrition-type=cooking&ingr=" +
        amount + '%20' + measure + '%20' + food;

      fetch(requestUrl)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              console.log(data.calories);
              console.log(data.totalDaily);
              displayFoodResult(data, food, amount, measure);
            });
          } else {
            alert("Error: " + response.statusText);
          }
        })
        .catch(function (error) {
          alert("Unable to connect to the server");
        });
     // Store to local, avoid repetitive input 
     let foodObject = {
      foodName: food,
      quantity: amount,
      measurementUnit: measure,
    }

    let savedFoods = JSON.parse(localStorage.getItem('foodObject')) || [];
    if (savedFoods.length >= 10) {
      savedFoods.shift();
    }

    // check for exisiting 
    let itemExists = savedFoods.some(savedFood =>
      savedFood.foodName.toUpperCase() === foodObject.foodName.toUpperCase() &&
      savedFood.quantity === foodObject.quantity &&
      savedFood.measurementUnit === foodObject.measurementUnit
    );

    if (!itemExists) {
      savedFoods.push(foodObject);
      localStorage.setItem('foodObject', JSON.stringify(savedFoods));
    }
  }

  // Fetch data for TDEE search
  function getTDEE(weight, height, age, gender, activityLevel) {

    // Fetch for TDEE
    let XRapidAPIKey = "1cad2c1280mshd2a5acc41eef7ebp10ec4djsnf30acec351ba"
    let XRapidAPIHost = "mega-fitness-calculator1.p.rapidapi.com";
    let url =
      "https://mega-fitness-calculator1.p.rapidapi.com/tdee?weight=" +
      weight +
      "&height=" +
      height +
      "&activitylevel=" +
      activityLevel +
      "&age=" +
      age +
      "&gender=" +
      gender;

    let options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": XRapidAPIKey,
        "X-RapidAPI-Host": XRapidAPIHost,
      },
    };
    fetch(url, options).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayTDEEResult(data, weight, height, age, gender, activityLevel);
        });
      }
    });

        // Store to local, avoid repetitive input 
        let tdeeObject = {
          weight: weight,
          height: height,
          age: age,
          gender: gender,
          activityLevel: activityLevel,
        }
    
        // check for exisiting 
        let savedTDEEs = JSON.parse(localStorage.getItem('tdeeObject')) || [];
        if (savedTDEEs.length >= 10) {
          savedTDEEs.shift();
        }
    
        let itemExists = savedTDEEs.some(savedTDEE =>
          savedTDEE.weight === tdeeObject.weight &&
          savedTDEE.height === tdeeObject.height &&
          savedTDEE.age === tdeeObject.age &&
          savedTDEE.gender === tdeeObject.gender &&
          savedTDEE.activityLevel === tdeeObject.activityLevel
        );
    
        if (!itemExists) {
          savedTDEEs.push(tdeeObject);
    
          localStorage.setItem('tdeeObject', JSON.stringify(savedTDEEs));
        }
    
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
      })
    );
  }

  // Display the search result for Nutrients Info
  function displayFoodResult(data, food, amount, measure) {
    // Extract relevant information from the API response
    while (resultsEl.firstChild) {
      resultsEl.removeChild(resultsEl.firstChild);
    }

    let foodInfo = document.createElement("h3");
    let capFood = food.charAt(0).toUpperCase() + food.slice(1);
    foodInfo.textContent = capFood + ', ' + amount + ' ' + measure + '(s)';
    resultsEl.appendChild(foodInfo);

    if (data.calories) {
      let calories = document.createElement("p");
      calories.textContent = "Calories " + Math.round(data.calories, 2);
      resultsEl.appendChild(calories);
    } else {
      let calories = document.createElement("p");
      calories.textContent = "Calories  - ";
      resultsEl.appendChild(calories);
    }


    if (data.totalDaily.FAT) {
      let Fat = document.createElement("p");
      Fat.textContent =
        data.totalDaily.FAT.label +
        " " +
        Math.round(data.totalDaily.FAT.quantity, 2) +
        data.totalDaily.FAT.unit;
      resultsEl.appendChild(Fat);
    } else {
      let Fat = document.createElement("p");
      Fat.textContent = "Fat - ";
      resultsEl.appendChild(Fat);
    }

    if (data.totalDaily.FASAT) {
      let satFat = document.createElement("p");
      satFat.textContent =
        data.totalDaily.FASAT.label +
        " " +
        Math.round(data.totalDaily.FASAT.quantity, 2) +
        data.totalDaily.FASAT.unit;
      resultsEl.appendChild(satFat);
    } else {
      let satFat = document.createElement("p");
      satFat.textContent = "Saturated  - ";
      resultsEl.appendChild(satFat);
    }

    if (data.totalDaily.CHOCDF) {
      let carb = document.createElement("p");
      carb.textContent =
        data.totalDaily.CHOCDF.label +
        " " +
        Math.round(data.totalDaily.CHOCDF.quantity, 2) +
        data.totalDaily.CHOCDF.unit;
      resultsEl.appendChild(carb);
    } else {
      let carb = document.createElement("p");
      carb.textContent = "Carbs   -";
      resultsEl.appendChild(carb);
    }
    if (data.totalDaily.PROCNT) {
      let protein = document.createElement("p");
      protein.textContent =
        data.totalDaily.PROCNT.label +
        " " +
        Math.round(data.totalDaily.PROCNT.quantity, 2) +
        data.totalDaily.PROCNT.unit;
      resultsEl.appendChild(protein);
    } else {
      let protein = document.createElement("p");
      protein.textContent = "protein   -";
      resultsEl.appendChild(protein);
    }
    if (data.totalDaily.VITA_RAE) {
      let vitA = document.createElement("p");
      vitA.textContent =
        data.totalDaily.VITA_RAE.label +
        " " +
        Math.round(data.totalDaily.VITA_RAE.quantity, 2) +
        data.totalDaily.VITA_RAE.unit;
      resultsEl.appendChild(vitA);
    } else {
      let vitA = document.createElement("p");
      vitA.textContent = "Vitamin A   - ";
      resultsEl.appendChild(vitA);
    }
    if (data.totalDaily.VITC) {
      let vitC = document.createElement("p");
      vitC.textContent =
        data.totalDaily.VITC.label +
        " " +
        Math.round(data.totalDaily.VITC.quantity, 2) +
        data.totalDaily.VITC.unit;
      resultsEl.appendChild(vitC);
    } else {
      let vitC = document.createElement("p");
      vitC.textContent = "Vitamin C  - ";
      resultsEl.appendChild(vitC);
    }
    if (data.totalDaily.VITD) {
      let vitD = document.createElement("p");
      vitD.textContent =
        data.totalDaily.VITD.label +
        " " +
        Math.round(data.totalDaily.VITD.quantity, 2) +
        data.totalDaily.VITD.unit;
      resultsEl.appendChild(vitD);
    } else {
      let vitD = document.createElement("p");
      vitD.textContent = "Vitamin D -";
      resultsEl.appendChild(vitD);
    }

    if (data.totalDaily.CA) {
      let calcium = document.createElement("p");
      calcium.textContent =
        data.totalDaily.CA.label +
        " " +
        Math.round(data.totalDaily.CA.quantity, 2) +
        data.totalDaily.CA.unit;
      resultsEl.appendChild(calcium);
    } else {
      let calcium = document.createElement("p");
      calcium.textContent = "calcium  -";
      resultsEl.appendChild(calcium);
    }
    if (data.totalDaily.K) {
      let potassium = document.createElement("p");
      potassium.textContent =
        data.totalDaily.K.label +
        " " +
        Math.round(data.totalDaily.K.quantity, 2) +
        data.totalDaily.K.unit;
      resultsEl.appendChild(potassium);
    } else {
      let potassium = document.createElement("p");
      potassium.textContent = "potassium  -";
      resultsEl.appendChild(potassium);
    }
    if (data.totalDaily.FE) {
      let iron = document.createElement("p");
      iron.textContent =
        data.totalDaily.FE.label +
        " " +
        Math.round(data.totalDaily.FE.quantity, 2) +
        data.totalDaily.FE.unit;
      resultsEl.appendChild(iron);
    } else {
      let iron = document.createElement("p");
      iron.textContent = "iron  -";
      resultsEl.appendChild(iron);
    }
  }

  // Display the search result for Nutrients Info
  function displayTDEEResult(data, weight, height, age, gender, activityLevel) {

    // Extract relevant information from the API response
    while (resultsEl.firstChild) {
      resultsEl.removeChild(resultsEl.firstChild);
    }

    let activitiyText;
    if (activityLevel = 'se') {
      activitiyText = "Sedentary (office job)"
    } else if (activityLevel = 'la') {
      activitiyText = "Light Exercise (1-2 days/week)"
    } else if (activityLevel = 'ma') {
      activitiyText = "Moderate Exercise (3-5 days/week)"
    } else {
      activitiyText = "Heavy Exercise (6-7 days/week)"
    }

    let TDEEInfo = document.createElement("h3");
    TDEEInfo.textContent = gender + ', ' +
      weight + ' kg, ' +
      height + ' cm, ' +
      age + ' years, ' +
      activitiyText;

    resultsEl.appendChild(TDEEInfo);

    if (data.info.tdee) {
      let TDEE = document.createElement("p");
      TDEE.textContent = "Total Daily Energy Expenditure: " +
        Math.round(data.info.tdee, 2) +
        ' calories per day';
      resultsEl.appendChild(TDEE);

    }
  }


  // Display saved searches for food
  function getFoodHistory() {
    let savedFoods = JSON.parse(localStorage.getItem('foodObject')) || [];
    if (savedFoods.length >= 10) {
      savedFoods.shift();
    }

    while (resultsEl.firstChild) {
      resultsEl.removeChild(resultsEl.firstChild);
    }

    for (let i = 0; i < savedFoods.length; i++) {
      let historyItem = document.createElement("button");
      historyItem.textContent = `${savedFoods[i].foodName}, ${savedFoods[i].quantity} ${savedFoods[i].measurementUnit}(s)`;
      historyItem.classList.add("history-item");

      console.log(historyItem)
      // Event listener to call getFoodInfo when the button is clicked
      historyItem.addEventListener("click", function () {
        getFoodInfo(savedFoods[i].foodName, savedFoods[i].quantity, savedFoods[i].measurementUnit);
      });

      resultsEl.appendChild(historyItem);

      //   }
      // }

      // Loop through saved cities and display item
      // for (savedFood of savedFoods) {

      //   let historyItem = `<button class='history-item'>${savedFood.foodName}, ${savedFood.quantity} ${savedFood.measurementUnit}(s)</button>`;
      //   document.getElementById('results').innerHTML += historyItem;
      //   console.log(historyItem)

    }
  }

  // Event Handler for Saved foods
  $(document).on('click', '.history-item', function (event) {
    event.preventDefault();
    let selectedFood = $(event.target).text();
    console.log(selectedFood);

    let clickedFood = selectedFood.split(", ");

    let food = clickedFood[0];
    let amount = Number(clickedFood[1].split(' ')[0]);
    let measurementUnit = clickedFood[1].split(' ')[1]
    let measure = measurementUnit.replace(/\(s\)/, '');


    console.log('F: ' + food);
    console.log(amount);
    console.log(measurementUnit);
    console.log(measure);

    console.log(typeof food);
    console.log(typeof amount);
    console.log(typeof measure);

    getFoodInfo(food, amount, measure);
  })
});