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
            const details = {
                humidity: Math.round(data.main.humidity),
                windSpeed: Math.round(data.wind.speed),
                windDirection: Math.round(data.wind.deg /45) % 8,
                pressure: Math.round(data.main.pressure)
            };
            let compassSector = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
            details.windDirection = compassSector[details.windDirection];
            document.getElementById('city').value = '';
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
            document.getElementById('weather-icon').style.display = 'block';
            document.getElementById('weather-info').innerHTML = `
                <h2>${weather.city}</h2>
                <p>${weather.temperature}°C</p>
                <p>${weather.description}</p>
            <div class="details">
                <i class="fa-solid fa-droplet"><span>${details.humidity}</span><span>%</span></i>  
                <i class="fa-solid fa-wind"><span>${details.windSpeed}</span><span>m/s</span></i>
                <i class="fa-solid fa-compass"><span>${details.windDirection}</span></i>
                <i class="fa-solid fa-circle-down"><span>${details.pressure}</span><span>hPa</span></i>
            </div>
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
                    <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="${item.description}">
                    <p>${item.temperature}°C</p>
                    `;
                forecastContainer.appendChild(forecastItem);
            });
            const daily = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5).map(item => {
                return {
                    date: new Date(item.dt * 1000).toLocaleDateString([], { day: '2-digit', month: '2-digit'}),
                    temperature: Math.round(item.main.temp),
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    fullDate: item.dt_txt.split(' ')[0]
                };
            });
            const dailyContainer = document.getElementById('daily-forecast');
            dailyContainer.innerHTML = ''; // Clear previous forecast
            daily.forEach(item => {
                const dailyItem = document.createElement('div');
                dailyItem.className = 'daily-item';
                dailyItem.innerHTML = `
                    <h3>${item.date}</h3>
                    <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="${item.description}">
                    <p>${item.temperature}°C</p>
                    `;
                    dailyItem.addEventListener('click', () => {
                // Update weather-icon
                document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${item.icon}@4x.png`;
                document.getElementById('weather-icon').style.display = 'block';
                // Extract weather details
                const selectedDetails = data.list.find(hourlyItem => hourlyItem.dt_txt.includes(item.fullDate));
                const humidity = Math.round(selectedDetails.main.humidity);
                const windSpeed = Math.round(selectedDetails.wind.speed);
                const windDirection = Math.round(selectedDetails.wind.deg / 45) % 8;
                const pressure = Math.round(selectedDetails.main.pressure);
                const compassSector = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
                const windDirectionText = compassSector[windDirection];
                // Update weather-info
                document.getElementById('weather-info').innerHTML = `
                    <h2>${city}</h2>
                    <p>${item.temperature}°C</p>
                    <p>${item.description}</p>
                    <div class="details">
                        <i class="fa-solid fa-droplet"><span>${humidity}</span><span>%</span></i>  
                        <i class="fa-solid fa-wind"><span>${windSpeed}</span><span>m/s</span></i>
                        <i class="fa-solid fa-compass"><span>${windDirectionText}</span></i>
                        <i class="fa-solid fa-circle-down"><span>${pressure}</span><span>hPa</span></i>
                    </div>
                `;

                // Update hourly-forecast
                const hourlyForecast = data.list.filter(hourlyItem => hourlyItem.dt_txt.includes(item.fullDate)).map(hourlyItem => {
                    return {
                        time: new Date(hourlyItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        temperature: Math.round(hourlyItem.main.temp),
                        description: hourlyItem.weather[0].description,
                        icon: hourlyItem.weather[0].icon
                    };
                });

                const forecastContainer = document.getElementById('hourly-forecast');
                forecastContainer.innerHTML = ''; // Clear previous forecast
                hourlyForecast.forEach(hourlyItem => {
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'forecast-item';
                    forecastItem.innerHTML = `
                        <h3>${hourlyItem.time}</h3>
                        <img src="https://openweathermap.org/img/wn/${hourlyItem.icon}.png" alt="${hourlyItem.description}">
                        <p>${hourlyItem.temperature}°C</p>
                    `;
                    forecastContainer.appendChild(forecastItem);
                });
            });
                dailyContainer.appendChild(dailyItem);
            });
        });
}