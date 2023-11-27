var latLon = []

var weatherData = []

$('#primarySubmit').on('click', function () {
    var cityName = $('#cityInput').val().trim()

    //var searchedCities = document.createElement('li')

    var locationApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`

    fetch(locationApi).then(function (locationData) {
        return locationData.json()
            .then(function (coordinates) {
                latLon.push(coordinates[0].lat);
                latLon.push(coordinates[0].lon);
                console.log(coordinates);
                console.log(latLon);
                fetchWeather();
            });
    });
    console.log(cityName);

    $('#searchedCities').append(`<button class="previousSearch" type="button">${cityName}</button>`)

})

function fetchWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latLon[0]}&lon=${latLon[1]}&limit=5&units=imperial&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`)
        .then(function (locationWeather) {
            return locationWeather.json()
                .then(function (weather) {
                    //console.log(weather);
                    //console.log(weather.list);
                    weatherData.push(weather)
                    weatherToday()
                    latLon = []

                });
        });
}

function weatherToday() {
    console.log(weatherData[0])
    var icon = weatherData[0].list[0].weather[0].icon
    $('#icon').attr('src', `https://openweathermap.org/img/w/${icon}.png`)
    $('#temperature').text(`Temprature: ${weatherData[0].list[0].main.temp} °F`)
    $('#wind').text(`Wind Speed: ${weatherData[0].list[0].wind.speed} MPH`)
    $('#humidity').text(`Humidity: ${weatherData[0].list[0].main.humidity} %`)

    console.log(latLon)
    weatherData = []
}