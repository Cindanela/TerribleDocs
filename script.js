// SMHI API endpoints
const BASE_URL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point';
const GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=sv';

// Väderikoner baserade på SMHIs väderkod
const weatherIcons = {
    1: 'fas fa-sun',           // Klar himmel
    2: 'fas fa-cloud-sun',     // Nästan klart himmel
    3: 'fas fa-cloud',         // Variabel molnighet
    4: 'fas fa-cloud-sun',     // Halvklart himmel
    5: 'fas fa-cloud',         // Molnigt himmel
    6: 'fas fa-cloud',         // Mulet
    7: 'fas fa-smog',          // Dimma
    8: 'fas fa-cloud-rain',    // Lätt regnskur
    9: 'fas fa-cloud-showers-heavy', // Måttlig regnskur
    10: 'fas fa-cloud-showers-heavy', // Kraftig regnskur
    11: 'fas fa-bolt',         // Åskväder
    12: 'fas fa-cloud-rain',   // Lätt snöblandat regn
    13: 'fas fa-cloud-rain',   // Måttligt snöblandat regn
    14: 'fas fa-cloud-rain',   // Kraftigt snöblandat regn
    15: 'fas fa-snowflake',    // Lätt snöskur
    16: 'fas fa-snowflake',    // Måttlig snöskur
    17: 'fas fa-snowflake',    // Kraftig snöskur
    18: 'fas fa-cloud-rain',   // Lätt regn
    19: 'fas fa-cloud-rain',   // Måttligt regn
    20: 'fas fa-cloud-showers-heavy', // Kraftigt regn
    21: 'fas fa-bolt',         // Åska
    22: 'fas fa-cloud-rain',   // Lätt snöblandat regn
    23: 'fas fa-cloud-rain',   // Måttligt snöblandat regn
    24: 'fas fa-cloud-rain',   // Kraftigt snöblandat regn
    25: 'fas fa-snowflake',    // Lätt snöfall
    26: 'fas fa-snowflake',    // Måttligt snöfall
    27: 'fas fa-snowflake'     // Kraftigt snöfall
};

// Väderbeskrivningar baserade på SMHIs väderkod
const weatherDescriptions = {
    1: 'Klar himmel',
    2: 'Nästan klart himmel',
    3: 'Variabel molnighet',
    4: 'Halvklart himmel',
    5: 'Molnigt himmel',
    6: 'Mulet',
    7: 'Dimma',
    8: 'Lätt regnskur',
    9: 'Måttlig regnskur',
    10: 'Kraftig regnskur',
    11: 'Åskväder',
    12: 'Lätt snöblandat regn',
    13: 'Måttligt snöblandat regn',
    14: 'Kraftigt snöblandat regn',
    15: 'Lätt snöskur',
    16: 'Måttlig snöskur',
    17: 'Kraftig snöskur',
    18: 'Lätt regn',
    19: 'Måttligt regn',
    20: 'Kraftigt regn',
    21: 'Åska',
    22: 'Lätt snöblandat regn',
    23: 'Måttligt snöblandat regn',
    24: 'Kraftigt snöblandat regn',
    25: 'Lätt snöfall',
    26: 'Måttligt snöfall',
    27: 'Kraftigt snöfall'
};

async function fetchWeatherData(longitude, latitude) {
    try {
        const response = await fetch(`${BASE_URL}/lon/${longitude}/lat/${latitude}/data.json`);
        if (!response.ok) {
            throw new Error('Kunde inte hitta väderdata för denna plats');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av väderdata:', error);
        throw error;
    }
}

async function getUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const longitude = position.coords.longitude.toFixed(4);
        const latitude = position.coords.latitude.toFixed(4);
        
        document.getElementById('locationInput').value = `${longitude},${latitude}`;
        
        const locationName = await getLocationName(longitude, latitude);
        const weatherData = await fetchWeatherData(longitude, latitude);
        
        // Uppdatera platsnamn
        const locationNameElement = document.getElementById('locationName');
        locationNameElement.textContent = locationName;
        locationNameElement.classList.add('visible');
        
        // Uppdatera UI med väderdata
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateForecast(weatherData);
        updateWarnings(weatherData);
    } catch (error) {
        console.error('Fel vid hämtning av position:', error);
        alert('Kunde inte hämta din position. Vänligen ange koordinater manuellt.');
    }
}

async function searchWeather() {
    const input = document.getElementById('locationInput').value.trim();
    const [longitude, latitude] = input.split(',').map(coord => parseFloat(coord.trim()));
    
    if (isNaN(longitude) || isNaN(latitude)) {
        alert('Vänligen ange giltiga koordinater i formatet: longitud,latitud');
        return;
    }
    
    try {
        const locationName = await getLocationName(longitude, latitude);
        const weatherData = await fetchWeatherData(longitude, latitude);
        
        // Uppdatera platsnamn
        const locationNameElement = document.getElementById('locationName');
        locationNameElement.textContent = locationName;
        locationNameElement.classList.add('visible');
        
        // Uppdatera UI med väderdata
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateForecast(weatherData);
        updateWarnings(weatherData);
    } catch (error) {
        console.error('Fel vid hämtning av väderdata:', error);
        alert('Ett fel uppstod vid hämtning av väderdata. Vänligen försök igen.');
    }
}

async function getLocationName(longitude, latitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=sv`);
        if (!response.ok) {
            throw new Error('Kunde inte hämta platsnamn');
        }
        const data = await response.json();
        const address = data.address;
        
        // Bygg en mer relevant platsbeskrivning
        let locationParts = [];
        
        // Lägg till stadsdel/ort om det finns
        if (address.suburb) {
            locationParts.push(address.suburb);
        } else if (address.neighbourhood) {
            locationParts.push(address.neighbourhood);
        }
        
        // Lägg till ort
        if (address.city) {
            locationParts.push(address.city);
        } else if (address.town) {
            locationParts.push(address.town);
        } else if (address.village) {
            locationParts.push(address.village);
        }
        
        // Lägg till län om det finns
        if (address.state) {
            locationParts.push(address.state);
        }
        
        // Om vi inte hittade någon relevant information, använd display_name
        if (locationParts.length === 0) {
            return data.display_name.split(',')[0];
        }
        
        return locationParts.join(', ');
    } catch (error) {
        console.error('Fel vid hämtning av platsnamn:', error);
        return 'Okänd plats';
    }
}

function updateCurrentWeather(data) {
    const parameters = getParameters(data.timeSeries[0].parameters);
    const weatherIcon = getWeatherIcon(parameters.Wsymb2);
    const weatherDescription = getWeatherDescription(parameters.Wsymb2);
    const date = new Date(data.timeSeries[0].validTime);
    const time = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    
    document.getElementById('currentWeather').querySelector('h2').innerHTML = `
        <i class="fas fa-sun"></i>
        Aktuellt väder
    `;
    
    document.getElementById('currentWeatherContent').innerHTML = `
        <div class="weather-card">
            <div class="weather-info">
                <h3><i class="${weatherIcon}"></i> ${time}</h3>
                <p class="weather-description">${weatherDescription}</p>
                <p>Temperatur: ${parameters.t}°C</p>
                <p>Känns som: ${parameters.ws}°C</p>
                <p>Vind: ${parameters.ws} m/s</p>
                <p>Luftfuktighet: ${parameters.r}%</p>
                <p>Luftkvalitet: ${getAirQuality(parameters.pm25)}</p>
            </div>
        </div>
    `;
}

function updateHourlyForecast(data) {
    const hourlyForecasts = data.timeSeries.slice(0, 5).map(forecast => {
        const parameters = getParameters(forecast.parameters);
        const weatherIcon = getWeatherIcon(parameters.Wsymb2);
        const weatherDescription = getWeatherDescription(parameters.Wsymb2);
        const date = new Date(forecast.validTime);
        const time = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="hourly-card">
                <div class="weather-info">
                    <div>
                        <span class="time"><i class="${weatherIcon}"></i> ${time}</span>
                        <span class="weather-description">${weatherDescription}</span>
                        <div class="hourly-details">
                            <span>Temperatur: ${parameters.t}°C</span>
                            <span>Känns som: ${parameters.ws}°C</span>
                            <span>Vind: ${parameters.ws} m/s</span>
                        </div>
                    </div>
                    <span class="temperature">${parameters.t}°C</span>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('hourlyForecast').querySelector('h2').innerHTML = `
        <i class="fas fa-clock"></i>
        Timprognos
    `;
    
    document.getElementById('hourlyForecastContent').innerHTML = hourlyForecasts;
}

function updateForecast(data) {
    const forecastsByDay = {};
    data.timeSeries.forEach(forecast => {
        const date = new Date(forecast.validTime);
        const dateKey = date.toLocaleDateString('sv-SE', { weekday: 'long' });
        if (!forecastsByDay[dateKey]) {
            forecastsByDay[dateKey] = forecast;
        }
    });
    
    const dailyForecasts = Object.entries(forecastsByDay)
        .slice(0, 5)
        .map(([date, forecast]) => {
            const parameters = getParameters(forecast.parameters);
            const weatherIcon = getWeatherIcon(parameters.Wsymb2);
            const weatherDescription = getWeatherDescription(parameters.Wsymb2);
            
            return `
                <div class="weather-card">
                    <div class="weather-info">
                        <h3><i class="${weatherIcon}"></i> ${date}</h3>
                        <p class="weather-description">${weatherDescription}</p>
                        <p>Temperatur: ${parameters.t}°C</p>
                        <p>Känns som: ${parameters.ws}°C</p>
                        <p>Vind: ${parameters.ws} m/s</p>
                    </div>
                </div>
            `;
        }).join('');
    
    document.getElementById('forecast').querySelector('h2').innerHTML = `
        <i class="fas fa-calendar"></i>
        5-dagars prognos
    `;
    
    document.getElementById('forecastContent').innerHTML = dailyForecasts;
}

function updateWarnings(data) {
    const warnings = data.warnings || [];
    const warningsHtml = warnings.map(warning => `
        <div class="warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <h3>${warning.title}</h3>
                <p>${warning.description}</p>
            </div>
        </div>
    `).join('');
    
    document.getElementById('warnings').querySelector('h2').innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        Vädervarningar
    `;
    
    document.getElementById('warningsContent').innerHTML = warningsHtml || '<p>Inga vädervarningar för tillfället</p>';
}

function getParameters(parameters) {
    const paramMap = {};
    parameters.forEach(param => {
        paramMap[param.name] = param.values[0];
    });
    return paramMap;
}

function getWeatherIcon(weatherCode) {
    return weatherIcons[weatherCode] || 'fas fa-question';
}

function getWeatherDescription(weatherCode) {
    return weatherDescriptions[weatherCode] || 'Okänt väder';
}

function formatDate(dateString, weekdayOnly = false) {
    const date = new Date(dateString);
    if (weekdayOnly) {
        return date.toLocaleDateString('sv-SE', { weekday: 'long' });
    }
    return date.toLocaleDateString('sv-SE');
}

// Hjälpfunktion för att beräkna luftkvalitet baserat på PM2.5
function getAirQuality(pm25) {
    if (pm25 <= 10) return 'Mycket bra';
    if (pm25 <= 20) return 'Bra';
    if (pm25 <= 25) return 'Acceptabel';
    if (pm25 <= 50) return 'Dålig';
    return 'Mycket dålig';
}

// Tema-hantering
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Kontrollera om användaren har ett sparat tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Använd systemets tema-inställning
        const isDark = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark ? 'dark' : 'light');
    }

    // Lyssna på ändringar i systemets tema-inställning
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeIcon(e.matches ? 'dark' : 'light');
        }
    });

    // Hantera manuell tema-växling
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Kör initTheme när sidan laddas
document.addEventListener('DOMContentLoaded', initTheme); 