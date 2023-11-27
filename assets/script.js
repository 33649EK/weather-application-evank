var latLon = []
var currentWeatherData = []
var cityName = ''

//Sets current date to top of weatherInfo div
$(document).ready(function () {
    $('#currentDate').text(`${dayjs().format('MMM D, YYYY')}`)
})

//Submits the inputted city to the geolocation apu
$('#primarySubmit').on('click', function () {
    cityName = $('#cityInput').val().trim()
    if ($(`#${cityName}`).length === 0) {
        $('#searchedCities').append(`<button id='${cityName}' class="previousSearch" type="button">${cityName}</button>`)
    }
    $('#cityInput').val('')
    fetchLocation()
})


//Grabs Latitude and Longitude for the city
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

                //Prints location information
                if (coordinates[0].state) {
                    $('#location').text(`${coordinates[0].name}, ${coordinates[0].state}, ${coordinates[0].country}`)
                } else {
                    $('#location').text(`${coordinates[0].name}, ${coordinates[0].country}`)
                }
                fetchWeather();
            });
    });

}


//Grabs all necessary weather information
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
                    //ChatGTP helped to write following line.
                    var filteredWeatherData = weather.list.filter((obj => obj.dt_txt.includes("12:00:00")))
                    console.log(filteredWeatherData)
                    weatherToday()
                    forecast(filteredWeatherData)
                    latLon = []
                });
        });
}

//Prints today's weather to the document
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

//Creates 5 day forecast cards
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

// Does the same as the submit button but with the search history buttons instead
$('#searchedCities').on('click', `.previousSearch`, function (e) {
    e.preventDefault()
    var prevCityName = $(e.target).attr('id')
    console.log(prevCityName)
    fetchPreviousLocation(prevCityName)
})

//Grabs lat and lon from geolocation api
function fetchPreviousLocation(prevCityName) {
    console.log(prevCityName)
    var previousLocationApi = `https://api.openweathermap.org/geo/1.0/direct?q=${prevCityName}&limit=1&appid=9eb8c6aa4ea4ae6290f1970b6f5629eb`

    fetch(previousLocationApi).then(function (prevLocationData) {
        return prevLocationData.json()
            .then(function (prevCoordinates) {
                latLon.push(prevCoordinates[0].lat);
                latLon.push(prevCoordinates[0].lon);
                console.log(prevCoordinates);
                console.log(latLon);
                //Prints location information
                if (prevCoordinates[0].state) {
                    $('#location').text(`${prevCoordinates[0].name}, ${prevCoordinates[0].state}, ${prevCoordinates[0].country}`)
                } else {
                    $('#location').text(`${prevCoordinates[0].name}, ${prevCoordinates[0].country}`)
                }
                fetchWeather();
            });
    });

}