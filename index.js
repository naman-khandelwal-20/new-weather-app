const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "f55c0be0628d4d52a40192604230210"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    console.log(`inside weather card`);
    if(index === 0) { 
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.last_updated.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.temp_c)}°C</h6>
                    <h6>Wind: ${weatherItem.wind_mph} M/S</h6>
                    <h6>Humidity: ${weatherItem.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src=${weatherItem.condition.icon} alt="weather-icon">
                    <h6>${weatherItem.text}</h6>
                </div>`;
    } else { 
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, location) => {
   // const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
//http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}
    // fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
    //     const uniqueForecastDays = [];
    //     const fiveDaysForecast = data.list.filter(forecast => {
    //         const forecastDate = new Date(forecast.dt_txt).getDate();
    //         if (!uniqueForecastDays.includes(forecastDate)) {
    //             return uniqueForecastDays.push(forecastDate);
    //         }
    //     });

      
    //     // fiveDaysForecast.forEach((weatherItem, index) => {
    //     //     const html = createWeatherCard(cityName, weatherItem, index);
    //     //     if (index === 0) {
    //     //         currentWeatherDiv.insertAdjacentHTML("beforeend", html);
    //     //     } else {
    //     //         weatherCardsDiv.insertAdjacentHTML("beforeend", html);
    //     //     }
    //     // });        
    // }).catch(() => {
    //     alert("An error occurred while fetching the weather forecast!");
    // });

     
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";
console.log(location);
    const html = createWeatherCard(cityName, location, 0);
    console.log(html);
    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
     //const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
     const API_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`
    fetch(API_URL).then(response => response.json()).then(data => {
        console.log(data.current);
        if (!Object.keys(data).length) return alert(`No coordinates found for ${cityName}`);
        const {  name ,lat ,lon} = data.location;
        getWeatherDetails(name, data.current);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; 
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { 
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());