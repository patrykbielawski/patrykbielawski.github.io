function getWeather() {
    const apiKey = '01bbc75d32ad5eaa623474c1d849c8ff';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(currentWeatherUrl) 
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })    
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching current weather. Please try again.');
        });
     
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })    
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
            alert('Error fetching hourly forecast. Please try again.');
        });
}

function displayWeather(data) {

    const tempInfo = document.getElementById('temp');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempInfo.innerHTML = '';
    weatherIcon.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = '<p>${data.message}</p>';
        } else {
        
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const temperatureHTML = '<p>${temperature}°C</p>';
        const weatherHTML = '<p>${cityName}</p><p>${description}</p>';

        tempInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
        }
    }

function displayHourlyForecast(hourlyData) {

    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const next24Hours = hourlyData.slice(0,8);

    next24Hours.forEach(item => {

        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const hourlyItemHTML = `
            <div class="hourly-item">
                <p>${hour}:00</p>
                <img src="${iconUrl}" alt="Weather icon">
                <p>${temperature}°C</p>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHTML;
        });
}    

function showImage() {

    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
    }