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
let foodResultsEl = document.getElementById("foodResults");
let tdeeResultsEl = document.getElementById("tdeeResults");
let activityTextEl = document.querySelector(".activityText");
let durationEl = document.getElementById("duration");
let activityResultsEl = document.getElementById("activityResults");
let alertEl = document.getElementById("alert");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

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

    if (!foodText.value || !amount || !measureEl) {
      alertEl.textContent = "Please fill all mandatory fields!";
      modal.style.display = "block";
      return;
    }
    if (isNaN(amount)) {
      alertEl.textContent = "Please enter a number!";
      modal.style.display = "block";
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
      alertEl.textContent = "Please fill all mandatory fields!";
      modal.style.display = "block";
      return;
    } else if (isNaN(weight) || isNaN(height) || isNaN(age) || (weight == 0) || (height == 0) || (age == 0)) {
      alertEl.textContent = "Please enter a number!";
      modal.style.display = "block";
    } else {
      getTDEE(weight, height, age, gender, activityLevel);
      $(".weight").val("");
      $(".height").val("");
      $("#age").val("");
      $("#gender").val("Gender");
      $("#activity").val("Choose an activity level");
    }
  }

  // Event Handler for saved food searches
  $(".foodForm .btn").on("click", function () {
    getFoodHistory();
  });

  function activitySearch() {
    event.preventDefault();
    let activityText = activityTextEl.value;
    let duration = durationEl.value;

    if (!activityText || !duration) {
      alertEl.textContent = "Please fill all mandatory fields!";
      modal.style.display = "block";
    } else if (isNaN(duration)) {
      alertEl.textContent = "Please enter a number!";
      modal.style.display = "block";
    } else {
      getActivityInfo(activityText, duration);
      $(".activityText").val("");
      $("#duration").val("");
    }
  }
  // Event Handler for saved food searches
  $(".foodForm .btn").on("click", function () {
    getFoodHistory();
  });

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
      amount +
      "%20" +
      measure +
      "%20" +
      food;

    fetch(requestUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displayFoodResult(data, food, amount, measure);
            saveFoodInfo(food, amount, measure);
          });
        } else {
          alertEl.textContent = "Error: " + response.statusText;
          modal.style.display = "block";
        }
      })
      .catch(function (error) {
        alertEl.textContent = "Unable to connect to the server";
        modal.style.display = "block";
      });
  }

  function saveFoodInfo(food, amount, measure) {
    let foodObject = {
      foodName: food,
      quantity: amount,
      measurementUnit: measure,
    };

    let savedFoods = JSON.parse(localStorage.getItem("foodObject")) || [];
    if (savedFoods.length >= 10) {
      savedFoods.shift();
    }

    // check for exisiting
    let itemExists = savedFoods.some(
      (savedFood) =>
        savedFood.foodName.toUpperCase() ===
          foodObject.foodName.toUpperCase() &&
        savedFood.quantity == foodObject.quantity &&
        savedFood.measurementUnit === foodObject.measurementUnit
    );

    if (!itemExists) {
      savedFoods.push(foodObject);
      localStorage.setItem("foodObject", JSON.stringify(savedFoods));
    }
  }

  // Fetch data for TDEE search
  function getTDEE(weight, height, age, gender, activityLevel) {
    // Fetch for TDEE
    let XRapidAPIKey = "1cad2c1280mshd2a5acc41eef7ebp10ec4djsnf30acec351ba";
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
    };

    // check for exisiting
    let savedTDEEs = JSON.parse(localStorage.getItem("tdeeObject")) || [];
    if (savedTDEEs.length >= 10) {
      savedTDEEs.shift();
    }

    let itemExists = savedTDEEs.some(
      (savedTDEE) =>
        savedTDEE.weight === tdeeObject.weight &&
        savedTDEE.height === tdeeObject.height &&
        savedTDEE.age === tdeeObject.age &&
        savedTDEE.gender === tdeeObject.gender &&
        savedTDEE.activityLevel === tdeeObject.activityLevel
    );

    if (!itemExists) {
      savedTDEEs.push(tdeeObject);

      localStorage.setItem("tdeeObject", JSON.stringify(savedTDEEs));
    }
  }

  // Fetch data for activity search
  function getActivityInfo(activityText, duration) {
    let APIKey = "WtIp1I8eoOwneW7Y533fWIk78SoMiG6rEKqV9OJR";
    baseUrl = "https://api.api-ninjas.com/v1/caloriesburned?activity=";
    return fetch(baseUrl + activityText + "&duration=" + duration, {
      headers: { "x-api-key": APIKey },
    }).then((response) =>
      response.json().then(function (data) {
        displayActivityResult(data, activityText, duration);
      })
    );
  }

  // Display the search result for Nutrients Info
  function displayFoodResult(data, food, amount, measure) {
    // Extract relevant information from the API response
    while (foodResultsEl.firstChild) {
      foodResultsEl.removeChild(foodResultsEl.firstChild);
    }
    foodResultsEl.classList.remove("hidden");
    let foodInfo = document.createElement("h3");
    let capFood = food.charAt(0).toUpperCase() + food.slice(1);
    foodInfo.textContent = capFood + ", " + amount + " " + measure + "(s)";
    foodResultsEl.appendChild(foodInfo);

    if (data.calories) {
      let calories = document.createElement("p");
      calories.textContent = "Calories " + Math.round(data.calories, 2);
      foodResultsEl.appendChild(calories);
    } else {
      let calories = document.createElement("p");
      calories.textContent = "Calories  - ";
      foodResultsEl.appendChild(calories);
    }

    if (data.totalDaily.FAT) {
      let Fat = document.createElement("p");
      Fat.textContent =
        data.totalDaily.FAT.label +
        " " +
        Math.round(data.totalDaily.FAT.quantity, 2) +
        data.totalDaily.FAT.unit;
      foodResultsEl.appendChild(Fat);
    } else {
      let Fat = document.createElement("p");
      Fat.textContent = "Fat - ";
      foodResultsEl.appendChild(Fat);
    }

    if (data.totalDaily.FASAT) {
      let satFat = document.createElement("p");
      satFat.textContent =
        data.totalDaily.FASAT.label +
        " " +
        Math.round(data.totalDaily.FASAT.quantity, 2) +
        data.totalDaily.FASAT.unit;
      foodResultsEl.appendChild(satFat);
    } else {
      let satFat = document.createElement("p");
      satFat.textContent = "Saturated  - ";
      foodResultsEl.appendChild(satFat);
    }

    if (data.totalDaily.CHOCDF) {
      let carb = document.createElement("p");
      carb.textContent =
        data.totalDaily.CHOCDF.label +
        " " +
        Math.round(data.totalDaily.CHOCDF.quantity, 2) +
        data.totalDaily.CHOCDF.unit;
      foodResultsEl.appendChild(carb);
    } else {
      let carb = document.createElement("p");
      carb.textContent = "Carbs   -";
      foodResultsEl.appendChild(carb);
    }
    if (data.totalDaily.PROCNT) {
      let protein = document.createElement("p");
      protein.textContent =
        data.totalDaily.PROCNT.label +
        " " +
        Math.round(data.totalDaily.PROCNT.quantity, 2) +
        data.totalDaily.PROCNT.unit;
      foodResultsEl.appendChild(protein);
    } else {
      let protein = document.createElement("p");
      protein.textContent = "Protein   -";
      foodResultsEl.appendChild(protein);
    }
    if (data.totalDaily.VITA_RAE) {
      let vitA = document.createElement("p");
      vitA.textContent =
        data.totalDaily.VITA_RAE.label +
        " " +
        Math.round(data.totalDaily.VITA_RAE.quantity, 2) +
        data.totalDaily.VITA_RAE.unit;
      foodResultsEl.appendChild(vitA);
    } else {
      let vitA = document.createElement("p");
      vitA.textContent = "Vitamin A   - ";
      foodResultsEl.appendChild(vitA);
    }
    if (data.totalDaily.VITC) {
      let vitC = document.createElement("p");
      vitC.textContent =
        data.totalDaily.VITC.label +
        " " +
        Math.round(data.totalDaily.VITC.quantity, 2) +
        data.totalDaily.VITC.unit;
      foodResultsEl.appendChild(vitC);
    } else {
      let vitC = document.createElement("p");
      vitC.textContent = "Vitamin C  - ";
      foodResultsEl.appendChild(vitC);
    }
    if (data.totalDaily.VITD) {
      let vitD = document.createElement("p");
      vitD.textContent =
        data.totalDaily.VITD.label +
        " " +
        Math.round(data.totalDaily.VITD.quantity, 2) +
        data.totalDaily.VITD.unit;
      foodResultsEl.appendChild(vitD);
    } else {
      let vitD = document.createElement("p");
      vitD.textContent = "Vitamin D -";
      foodResultsEl.appendChild(vitD);
    }

    if (data.totalDaily.CA) {
      let calcium = document.createElement("p");
      calcium.textContent =
        data.totalDaily.CA.label +
        " " +
        Math.round(data.totalDaily.CA.quantity, 2) +
        data.totalDaily.CA.unit;
      foodResultsEl.appendChild(calcium);
    } else {
      let calcium = document.createElement("p");
      calcium.textContent = "Calcium  -";
      foodResultsEl.appendChild(calcium);
    }
    if (data.totalDaily.K) {
      let potassium = document.createElement("p");
      potassium.textContent =
        data.totalDaily.K.label +
        " " +
        Math.round(data.totalDaily.K.quantity, 2) +
        data.totalDaily.K.unit;
      foodResultsEl.appendChild(potassium);
    } else {
      let potassium = document.createElement("p");
      potassium.textContent = "Potassium  -";
      foodResultsEl.appendChild(potassium);
    }
    if (data.totalDaily.FE) {
      let iron = document.createElement("p");
      iron.textContent =
        data.totalDaily.FE.label +
        " " +
        Math.round(data.totalDaily.FE.quantity, 2) +
        data.totalDaily.FE.unit;
      foodResultsEl.appendChild(iron);
    } else {
      let iron = document.createElement("p");
      iron.textContent = "Iron  -";
      foodResultsEl.appendChild(iron);
    }
  }

  // Display the search result for Nutrients Info
  function displayTDEEResult(data, weight, height, age, gender, activityLevel) {
    // Extract relevant information from the API response
    while (tdeeResultsEl.firstChild) {
      tdeeResultsEl.removeChild(tdeeResultsEl.firstChild);
    }
    tdeeResultsEl.classList.remove("hidden");
    let activitiyText;
    if (activityLevel == "se") {
      activitiyText = "Sedentary (office job)";
    } else if (activityLevel == "la") {
      activitiyText = "Light Exercise (1-2 days/week)";
    } else if (activityLevel == "ma") {
      activitiyText == "Moderate Exercise (3-5 days/week)";
    } else {
      activitiyText == "Heavy Exercise (6-7 days/week)";
    }

    let TDEEInfo = document.createElement("ul");

    TDEEInfo.style.listStyleType = "none";
    let genderItem = document.createElement("li");
    genderItem.textContent = "Gender: " + gender;
    TDEEInfo.appendChild(genderItem);

    let weightItem = document.createElement("li");
    weightItem.textContent = "Weight: " + weight + " kg";
    TDEEInfo.appendChild(weightItem);

    let heightItem = document.createElement("li");
    heightItem.textContent = "Height: " + height + " cm";
    TDEEInfo.appendChild(heightItem);

    let ageItem = document.createElement("li");
    ageItem.textContent = "Age: " + age + " years";
    TDEEInfo.appendChild(ageItem);

    let activityItem = document.createElement("li");
    activityItem.textContent = "Activity Level: " + activitiyText;
    TDEEInfo.appendChild(activityItem);

    tdeeResultsEl.appendChild(TDEEInfo);

    if (data.info.tdee) {
      let TDEE = createListItem(
        "TDEE: " +
          "<strong>" +
          Math.round(data.info.tdee, 2) +
          " calories/day</strong>"
      );
      TDEEInfo.appendChild(TDEE);
    }

    function createListItem(content) {
      let listItem = document.createElement("li");
      listItem.innerHTML = content;
      return listItem;
    }
  }

  function displayActivityResult(data, activityText, duration) {
    // Extract relevant information from the API response
    while (activityResultsEl.firstChild) {
      activityResultsEl.removeChild(activityResultsEl.firstChild);
    }
    activityResultsEl.classList.remove("hidden");
    let activityInfo = document.createElement("h3");
    let capActivity =
      activityText.charAt(0).toUpperCase() + activityText.slice(1);
      if (duration == 0) {
        duration = 60;
      }
    activityInfo.textContent = capActivity + ", " + duration + " minutes";
    activityResultsEl.appendChild(activityInfo);

    let avtivityInfoList = document.createElement("ul");

    avtivityInfoList.style.listStyleType = "none";

    let activityFound = false;

    for (let i = 0; i < 10; i++) {
      if (data[i]) {
        let activityItem = document.createElement("li");
        let fullActivityName = data[i].name;
        let activityParts = fullActivityName.split("(");
        let trimmedName = activityParts[0].trim();

        let activityTextSpan = document.createElement("span");
        activityTextSpan.textContent = trimmedName + ": ";

        let caloriesStrong = document.createElement("strong");
        caloriesStrong.textContent = data[i].total_calories + " cal";

        activityItem.appendChild(activityTextSpan);
        activityItem.appendChild(caloriesStrong);
        avtivityInfoList.appendChild(activityItem);

        activityFound = true;
      }
    }
    if (!activityFound) {
      let noActivityItem = document.createElement("li");
      noActivityItem.textContent = "Activity not found";
      avtivityInfoList.appendChild(noActivityItem);
    }

    activityResultsEl.appendChild(avtivityInfoList);
  }
  // Display saved searches for food
  function getFoodHistory() {
    let savedFoods = JSON.parse(localStorage.getItem("foodObject")) || [];
    if (savedFoods.length >= 10) {
      savedFoods.shift();
    }

    while (foodResultsEl.firstChild) {
      foodResultsEl.removeChild(foodResultsEl.firstChild);
    }
    foodResultsEl.classList.remove("hidden");

    for (let i = 0; i < savedFoods.length; i++) {
      let historyItem = document.createElement("button");
      historyItem.textContent = `${savedFoods[i].foodName}, ${savedFoods[i].quantity} ${savedFoods[i].measurementUnit}(s)`;
      historyItem.classList.add("history-item");

      foodResultsEl.appendChild(historyItem);
    }
  }

  // Event Handler for saved foods buttons
  $(document).on("click", ".history-item", function (event) {
    event.preventDefault();
    let selectedFood = $(event.target).text();
    let clickedFood = selectedFood.split(", ");
    let food = clickedFood[0];
    let amount = Number(clickedFood[1].split(" ")[0]);
    let measurementUnit = clickedFood[1].split(" ")[1];
    let measure = measurementUnit.replace(/\(s\)/, "");

    getFoodInfo(food, amount, measure);
  });
});

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
