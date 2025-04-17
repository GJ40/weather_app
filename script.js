
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;
const submitBtn = document.getElementById("submit-btn");
const cityInput = document.getElementById("city");
const weatherContainer = document.getElementById("weather-container");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const errorMessage = document.getElementById("error-message");
const additionalDataSection = document.getElementById("additional-data");
const windSpeedElement = document.getElementById("wind-speed");
const visibilityElement = document.getElementById("visibility");
const humidityElement = document.getElementById("humidity");

const placeElement = document.getElementById("place");
const timeElement = document.getElementById("time");

const apiKey = "2d70184fe4ca0b86a23405b70dc0dc1a"; // Replace with your OpenWeatherMap API key

// Switch between light and dark mode
themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");
    if (body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "☀️";
    } else {
        themeToggleBtn.textContent = "🌙";
    }
});

// function to display weather data
function displayWeatherData(data){
    // Display the weather data
    const { main, weather, wind, visibility: visibilityValue, name } = data;
    weatherContainer.classList.remove("hidden");
    additionalDataSection.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    placeElement.textContent = `${name}`;
    const timezoneOffsetSeconds = data.timezone;
    const utcNow = new Date();
    const localTime = new Date(utcNow.getTime() + timezoneOffsetSeconds * 1000);

    // Format time as 00:00:00 AM/PM
    const formattedTime = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    timeElement.textContent = formattedTime

    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="Weather Icon">`;
    weatherDescription.textContent = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
    temperature.textContent = `${main.temp}°C`;

    // Additional Data (Wind, Visibility)
    windSpeedElement.textContent = `${wind.speed} m/s`;
    visibilityElement.textContent = `${(visibilityValue / 1000).toFixed(2)} km`;
    humidityElement.textContent = `${main.humidity} %`;
}

// Fetch weather data from OpenWeatherMap API
submitBtn.addEventListener("click", async () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert("Please enter a city.");
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === "404") {
            throw new Error("City not found");
        }

        // Display the weather data
        displayWeatherData(data);

    } catch (error) {
        weatherContainer.classList.add("hidden");
        additionalDataSection.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
});


// fetch weather data of current location
async function getWeatherCurrPos(position) {
    const [lat, lon] = [position.coords.latitude, position.coords.longitude];
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        // console.log(data);

        if (data.cod === "404") {
            throw new Error("City not found");
        }

        // Display the weather data
        displayWeatherData(data);

    } catch (error) {
        weatherContainer.classList.add("hidden");
        additionalDataSection.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }

}


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherCurrPos);
}
else{
    console.log("Geolocation is not supported by this browser.")
}