var latLon = []

var currentWeatherData = []

var weatherData = []

$(document).ready(function () {
    $('#currentDate').text(`${dayjs().format('MMM D, YYYY')}`)
})


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

    $('#searchedCities').append(`<button id='${cityName}' class="previousSearch" type="button">${cityName}</button>`)

})

function fetchWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latLon[0]}&lon=${latLon[1]}&units=imperial&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`)
        .then(function (locationCurrentWeather) {
            return locationCurrentWeather.json()
                .then(function (currentWeather) {
                    currentWeatherData.push(currentWeather)
                });
        });



    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latLon[0]}&lon=${latLon[1]}&limit=5&units=imperial&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`)
        .then(function (locationWeather) {
            return locationWeather.json()
                .then(function (weather) {
                    //console.log(weather);
                    //console.log(weather.list);
                    weatherData.push(weather)
                    weatherToday()
                    forecast()
                    latLon = []
                });
        });
}

function weatherToday() {
    console.log(currentWeatherData[0])
    var currentIcon = currentWeatherData[0].weather[0].icon
    $('#currentIcon').attr('src', `https://openweathermap.org/img/w/${currentIcon}.png`)
    $('#temperature').text(`Temprature: ${currentWeatherData[0].main.temp} °F`)
    $('#wind').text(`Wind Speed: ${currentWeatherData[0].wind.speed} MPH`)
    $('#humidity').text(`Humidity: ${currentWeatherData[0].main.humidity} %`)

    console.log(latLon)
    currentWeatherData = []
}

function forecast() {
    weatherDataIndex = [0, 7, 15, 31, 39]
    console.log(weatherData[0].list)

    $('.forecast-card').remove()

    for (i = 0; i < weatherDataIndex.length; i++) {
        $('#forecast').append(`<div class='forecast-card bg-primary text-light'>
    <h5 id='date${i}'></h5>
    <img id='icon${i}' src="" alt="">
    <h6 id='temperature${i}'></h6>
    <h6 id='wind${i}'></h6>
    <h6 id='humidity${i}'></h6>
</div>`)

        var icon = weatherData[0].list[weatherDataIndex[i]].weather[0].icon
        $(`#date${i}`).text(`${dayjs().add(i + 1, 'day').format('MMM D, YYYY')}`)
        $(`#icon${i}`).attr('src', `https://openweathermap.org/img/w/${icon}.png`)
        $(`#temperature${i}`).text(`Temp: ${weatherData[0].list[weatherDataIndex[i]].main.temp} °F`)
        $(`#wind${i}`).text(`Wind: ${weatherData[0].list[weatherDataIndex[i]].wind.speed} MPH`)
        $(`#humidity${i}`).text(`Humidity: ${weatherData[0].list[weatherDataIndex[i]].main.humidity} %`)


    }
    weatherData = []
}