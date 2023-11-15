document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'eafe703231444d8dce0fa1c3291e9dfb';
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const weatherResults = document.getElementById('weatherResults');
    const currentWeather = document.getElementById('currentWeather');
    const forecast = document.getElementById('forecast');
    const searchHistory = document.getElementById('searchHistory');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city !== '') {
            console.log(`Searching for weather in ${city}`);
            getWeatherData(city);
        }
    });

    function getWeatherData(city) {
        const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        fetch(geocodingApiUrl)
            .then(response => response.json())
            .then(data => {
                const { lat, lon } = data[0] || {};
                console.log(`Coordinates for ${city}: Latitude ${lat}, Longitude ${lon}`);

                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

                return fetch(weatherApiUrl);
            })
            .then(response => response.json())
            .then(data => {
                console.log('Weather Data:', data);
                displayWeatherResults(data.city, city);
                displayCurrentWeather(data.list[0]);
                displayForecast(data.list.slice(1, 6));
                addToSearchHistory(city);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }

    function displayWeatherResults(cityData, userQuery) {
        const weatherResultsHTML = `
            <h2>${userQuery}</h2>
            <p>City: ${cityData.name}, ${cityData.country}</p>
            <p>Latitude: ${cityData.coord.lat}</p>
            <p>Longitude: ${cityData.coord.lon}</p>
        `;
        weatherResults.innerHTML = weatherResultsHTML;
    }

    function displayCurrentWeather(currentData) {
        const currentWeatherHTML = `
            <h2>Current Weather</h2>
            <p>Date: ${new Date(currentData.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: ${currentData.main.temp} K</p>
            <p>Humidity: ${currentData.main.humidity}%</p>
            <p>Weather: ${currentData.weather[0].description}</p>
        `;
        currentWeather.innerHTML = currentWeatherHTML;
    }

    function displayForecast(forecastData) {
        let forecastHTML = '<h2>5-Day Forecast</h2>';

        forecastData.forEach(forecastDay => {
            forecastHTML += `
                <div class="forecast-item">
                    <p>Date: ${new Date(forecastDay.dt * 1000).toLocaleDateString()}</p>
                    <p>Temperature: ${forecastDay.main.temp} K</p>
                    <p>Humidity: ${forecastDay.main.humidity}%</p>
                    <p>Weather: ${forecastDay.weather[0].description}</p>
                </div>
            `;
        });

        forecast.innerHTML = forecastHTML;
    }

    function addToSearchHistory(city) {
        const searchHistoryItem = document.createElement('p');
        searchHistoryItem.textContent = city;
        searchHistoryItem.addEventListener('click', function () {
            getWeatherData(city);
        });

        searchHistory.appendChild(searchHistoryItem);
    }
});
