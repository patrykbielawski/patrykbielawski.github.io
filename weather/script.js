document.getElementById('search').addEventListener('click', getWeather);

function getWeather(event) {
    event.preventDefault(); // Prevent form submission
    const city = document.getElementById('city').value;
        if (!city) {
            alert('Please enter a city name');
            return;
        }
    console.log(`Fetching weather data for city: ${city}`);    

    fetch(`https://weather.burek.it/data/2.5/weather?q=${city}&units=metric`)
        .then(response => {
            console.log('API response:', response);
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weather = {
                city: data.name,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: data.weather[0].icon
            };
            document.getElementById('city').value = '';
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;
            document.getElementById('weather-icon').style.display = 'block';
            document.getElementById('weather-info').innerHTML = `
                <h2>${weather.city}</h2>
                <p>${weather.temperature}°C</p>
                <p>${weather.description}</p>
                `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. Please try again.');
        });

    fetch(`https://weather.burek.it/data/2.5/forecast?q=${city}&units=metric`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const forecast = data.list.slice(0, 8).map(item => {
                return {
                    date: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temperature: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                };
            });
            const forecastContainer = document.getElementById('hourly-forecast');
            forecastContainer.innerHTML = ''; // Clear previous forecast
            forecast.forEach(item => {
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                forecastItem.innerHTML = `
                    <h3>${item.date}</h3>
                    <img src="http://openweathermap.org/img/wn/${item.icon}.png" alt="${item.description}">
                    <p>${item.temperature}°C</p>
                    `;
                forecastContainer.appendChild(forecastItem);
            });
        });
}