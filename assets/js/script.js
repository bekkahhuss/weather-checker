var weatherDataEl = document.querySelector(".weather-data");
var weekday = [
    "Sun", 
    "Mon", 
    "Tues", 
    "Wed", 
    "Thurs", 
    "Fri", 
    "Sat"
];
var month = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

var apiKey = "0d14ac98a1874c4037b8dd76c4fc2bd7";

var nameInput = document.getElementById('city-search-input');

document.querySelector('form.city-form').addEventListener('submit', function (e) {

    e.preventDefault();

    getCity(nameInput.value);    
});

var getCity = function(userInput) {
    
        var apiCityUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=5&appid=" + apiKey;
            fetch(apiCityUrl).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var cityObj = {Name: data[0].name, Lat: data[0].lat, Long: data[0].lon};
                    console.log(cityObj);
                    // console.log(userInput);
                    getWeatherData(cityObj);
                }
            )}
        })
};

var getWeatherData = function(input) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + input.Lat + "&lon=" + input.Long + "&exclude=hourly,daily&appid=" + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // console.log(data);
                    getForecast(input);
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};


var getForecast = function (input) {
    var apiForecastUrl_1 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + input.Lat + "&lon=" + input.Long + "&cnt=5&appid=" + apiKey + "&units=imperial";
    fetch(apiForecastUrl_1)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    weatherToday(data, input);
                    weatherForecast(data);
                    
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
        
}

var weatherToday = function(weatherData,city) {
    // Clear the main content and build the current weather display elements
    weatherDataEl.innerHTML = "";
    // Build current weather conditions icon request url
    var currWeatherContEl = document.createElement("div");
    var currWeatherInfoEl = document.createElement("div");
    var currWeatherHeadBlockEl = document.createElement("div");
    var currWeatherInfoBlockEl = document.createElement("div");
    var currCityEl = document.createElement("h2");
    currWeatherContEl.className = "weather-today";
    currWeatherInfoEl.className = "split-container" 
    currWeatherHeadBlockEl.className = "weather-details";
    currWeatherInfoBlockEl.className = "weather-details";
    currCityEl.className = "city-results";
    currCityEl.textContent = city.Name;
    var date = dateConvert(weatherData.current.dt);
    var currDateEl = document.createElement("h3");
    currDateEl.textContent = date.Month + " " + date.Date + ", " + date.Year;
    var currWeatherIcon = document.createElement("img");
    iconApiUrl = "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png";


    // Create icon and update weather data display element
    currWeatherIcon.src = iconApiUrl;
    var currTempEl = document.createElement("p");
    currTempEl.className = "current-data"


    // currTempEl.textContent = "Temp:  " + weatherData.current.temp + " F";
    currTempEl.innerHTML = "<span>Temp:  </span><span id='currentTemp'>" + weatherData.current.temp + " F</span>";
    var currWindEl = document.createElement("p");


    // currWindEl.textContent = "Wind:  " + weatherData.current.wind_speed + " mph";
    currWindEl.innerHTML = "<span>Wind:  </span><span id='currentWind'>" + weatherData.current.wind_speed + " mph</span>";
    var currHumidEl = document.createElement("p");


    // currHumidEl.textContent = "Humidity:  " + weatherData.current.humidity + " %";
    currHumidEl.innerHTML = "<span>Humidity:  </span><span id='currentHumid'>" + weatherData.current.humidity + " %</span>";
    var currUviEl = document.createElement("div");
    uviNum = parseFloat(weatherData.current.uvi);
    currUviEl.innerHTML = "<span>UV Index:  </span><span id='currentUv'>" + uviNum + "</span>";
    currWeatherHeadBlockEl.append(currDateEl, currWeatherIcon);
    currWeatherInfoBlockEl.append(currTempEl, currWindEl, currHumidEl, currUviEl);
    currWeatherContEl.appendChild(currCityEl)
    currWeatherInfoEl.appendChild(currWeatherHeadBlockEl);
    currWeatherInfoEl.appendChild(currWeatherInfoBlockEl);
    currWeatherContEl.appendChild(currWeatherInfoEl);
    weatherDataEl.appendChild(currWeatherContEl);


    // Color code the background of the UVI with EPA levels and color codes
    if (uviNum < 3.0) {
        document.querySelector("#currentUv").setAttribute("style", "background-color: rgb(0, 252, 0); color: black;");
    }
    else if (uviNum >= 3.0 && uviNum < 6.0) {
        document.querySelector("#currentUv").setAttribute("style", "background-color: rgb(252, 252, 0); color: black;)");
    }
    else if (uviNum >= 6.0 && uviNum < 8.0) {
        document.querySelector("#currentUv").setAttribute("style", "background-color: rgb(252, 126, 0); color: white;)");
    }
    else if (uviNum >= 8.0 && uviNum < 11.0) {
        document.querySelector("#currentUv").setAttribute("style", "background-color: rgb(252, 0, 0); color: white;)");
    }
    else {
        document.querySelector("#currentUv").setAttribute("style", "background-color: rgb(126, 0, 252); color: white;)");
    }

};
    
var weatherForecast = function(data) {
    // Build the 5 day forecast
    var extendedForecastEl = document.createElement("div");
    var dayCardContainerEl = document.createElement("div");
    var fiveDayHeaderEl = document.createElement("h3");
    
    extendedForecastEl.className = "complete-forecast";
    fiveDayHeaderEl.textContent = "5-Day Forecast";
    dayCardContainerEl.className = "day-card-container";

    // Display the forecast section title
    extendedForecastEl.append(fiveDayHeaderEl,dayCardContainerEl);
    weatherDataEl.appendChild(extendedForecastEl);

    // Build the 5 day cards and display in the forecast section
    for (var index = 1; index<6; index++) {
        iconApiUrl = "https://openweathermap.org/img/wn/" + data.daily[index].weather[0].icon + "@2x.png";
        // Create the elements for the weather card
        var date = dateConvert(data.daily[index].dt);
        var forecastCardEl = document.createElement("div");
        var foreCardHeadEl = document.createElement("div");
        var foreCardInfoEl = document.createElement("div");
        var forecastDateEl = document.createElement("h4");
        var forecastIconEl = document.createElement("img");
        var forecastTempEl = document.createElement("p");
        var forecastWindEl = document.createElement("p");
        var forecastHumidityEl = document.createElement("p");


        forecastCardEl.className = "day-card";
        foreCardHeadEl.className = "forecast-head";
        foreCardInfoEl.className = "forecast-info";
        forecastDateEl.textContent = date.Day;
        forecastIconEl.src = iconApiUrl;
        forecastTempEl.textContent = "Temp:      " + data.daily[index].temp.max + " F";
        forecastWindEl.textContent = "Wind:     " + data.daily[index].wind_speed + " mph";
        forecastHumidityEl.textContent = "Humidity:     " + data.daily[index].humidity + " %";

        // append the weather data to the weather card
        foreCardHeadEl.appendChild(forecastDateEl);
        foreCardHeadEl.appendChild(forecastIconEl);
        foreCardInfoEl.appendChild(forecastTempEl);
        foreCardInfoEl.appendChild(forecastWindEl);
        foreCardInfoEl.appendChild(forecastHumidityEl);

        // Append daily weather card to the container
        forecastCardEl.appendChild(foreCardHeadEl);
        forecastCardEl.appendChild(foreCardInfoEl);
        dayCardContainerEl.appendChild(forecastCardEl);
    }
};

var dateConvert = function(date) {
    // Convert UNIX time code passed to function to JS date/time
    fullDateConverted = new Date(date * 1000);
    // Extract day/date info from converted date/time
    var day = fullDateConverted.getDay();
    var month = fullDateConverted.getMonth();
    var date = fullDateConverted.getDate();
    var year = fullDateConverted.getFullYear();
    // Pass array with converted (to user-readable) day of week, month, date, and year
    var dayDateObject = {Day: weekday[day], Month: month[month], Date: date, Year: year};
    return dayDateObject;
};
getCity();
