var weatherData = document.querySelector(".weather-data");
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

    //prevent the normal submission of the form
    e.preventDefault();

    getCity(nameInput.value);    
});

var getCity = function(userInput) {
    // var userInput = document.querySelector("#city-search-input").value;
    // document.querySelector("#city-search-input").value = "";
    
    var apiCityUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userInput + "&limit=5&appid=" + apiKey;
        fetch(apiCityUrl).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var cityObj = {Name: data[0].name, Lat: data[0].lat, Long: data[0].lon};
                    console.log(cityObj);
                    console.log(userInput);
                    getWeatherData(cityObj);
                }
            )}
                else {
                    alert('Error: City Not Found');
                }
        })
};

var getWeatherData = function(input) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + input.Lat + "&lon=" + input.Long + "&exclude=hourly,daily&appid=" + apiKey;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // displaySearchResult(data);
                    console.log(data);
                });
            } else {
                alert("Error: " + response.statusText)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};


getCity();
getWeatherData();