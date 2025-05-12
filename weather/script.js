function getWeather() {

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
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${weather.icon}@4x.png`;
            document.getElementById('weather-info').innerHTML = `
                <h2>${weather.city}</h2>
                <p>Temperature: ${weather.temperature}°C</p>
                <p>Description: ${weather.description}</p>
                `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Could not fetch weather data. Please try again.');
        });
        
}