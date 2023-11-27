var latLon = []
var currentWeatherData = []
var cityName = ''

$(document).ready(function () {
    $('#currentDate').text(`${dayjs().format('MMM D, YYYY')}`)
})

$('#primarySubmit').on('click', function () {
    cityName = $('#cityInput').val().trim()
    if ($(`#${cityName}`).length === 0) {
        $('#searchedCities').append(`<button id='${cityName}' class="previousSearch" type="button">${cityName}</button>`)
    }
    fetchLocation()
})

function fetchLocation() {

    console.log(cityName)
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

}



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
                    var filteredWeatherData = weather.list.filter((obj => obj.dt_txt.includes("12:00:00")))
                    console.log(filteredWeatherData)
                    weatherToday()
                    forecast(filteredWeatherData)
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

function forecast(filteredWeatherData) {

    console.log(filteredWeatherData[0])

    $('.forecast-card').remove()

    for (i = 0; i < filteredWeatherData.length; i++) {
        $('#forecast').append(`<div class='forecast-card bg-primary text-light'>
    <h5 id='date${i}'></h5>
    <img id='icon${i}' src="" alt="">
    <h6 id='temperature${i}'></h6>
    <h6 id='wind${i}'></h6>
    <h6 id='humidity${i}'></h6>
</div>`)

        var icon = filteredWeatherData[i].weather[0].icon
        console.log(icon)
        $(`#date${i}`).text(`${dayjs().add(i + 1, 'day').format('MMM D, YYYY')}`)
        $(`#icon${i}`).attr('src', `https://openweathermap.org/img/w/${icon}.png`)
        $(`#temperature${i}`).text(`Temp: ${filteredWeatherData[i].main.temp} °F`)
        $(`#wind${i}`).text(`Wind: ${filteredWeatherData[i].wind.speed} MPH`)
        $(`#humidity${i}`).text(`Humidity: ${filteredWeatherData[i].main.humidity} %`)


    }
}


$('#searchedCities').on('click', `.previousSearch`, function (e) {
    e.preventDefault()
    var cityName2 = $(e.target).attr('id')
    console.log(cityName2)
    fetchPreviousLocation(cityName2)
})

function fetchPreviousLocation(cityName2) {

    console.log(cityName2)
    var previousLocationApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName2}&limit=1&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`

    fetch(previousLocationApi).then(function (prevLocationData) {
        return prevLocationData.json()
            .then(function (prevCoordinates) {
                latLon.push(prevCoordinates[0].lat);
                latLon.push(prevCoordinates[0].lon);
                console.log(prevCoordinates);
                console.log(latLon);
                fetchWeather();
            });
    });

}