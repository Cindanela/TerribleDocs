// SMHI API endpoints
const BASE_URL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point'; // Base URL for SMHI weather data API
const GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=sv'; // Base URL for Nominatim reverse geocoding API
const APPROVED_TIME_URL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/approvedtime.json'; // URL for approved time API
const PARAMETERS_URL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/parameter.json'; // URL for parameters API

// SMHI Warnings API endpoints
const WARNINGS_BASE_URL = 'https://opendata-download-warnings.smhi.se/ibww/api/version/1';
const WARNINGS_METADATA_URL = `${WARNINGS_BASE_URL}/metadata.json`;
const WARNINGS_ENTRY_URL = `${WARNINGS_BASE_URL}.json`;
const WARNINGS_ALL_URL = `${WARNINGS_BASE_URL}/metadata/all.json`;
const WARNINGS_AREA_URL = `${WARNINGS_BASE_URL}/metadata/area.json`;
const WARNINGS_EVENTS_URL = `${WARNINGS_BASE_URL}/metadata/events.json`;
const WARNINGS_LEVELS_URL = `${WARNINGS_BASE_URL}/metadata/warninglevels.json`;
const WARNINGS_DESCRIPTION_TITLES_URL = `${WARNINGS_BASE_URL}/metadata/descriptionTitles.json`;
const WARNINGS_EVENT_DESCRIPTIONS_URL = `${WARNINGS_BASE_URL}/metadata/eventDescriptions.json`;

// Väderikoner baserade på SMHIs väderkod
const weatherIcons = {
    1: 'fas fa-sun',           // Klar himmel
    2: 'fas fa-cloud-sun',     // Nästan klar himmel
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
    2: 'Nästan klar himmel',
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

// Function to fetch weather data from SMHI API
async function fetchWeatherData(longitude, latitude) {
    try {
        // Construct the API URL with longitude and latitude
        const response = await fetch(`${BASE_URL}/lon/${longitude}/lat/${latitude}/data.json`);
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Kunde inte hitta väderdata för denna plats');
        }
        // Parse the JSON response and return the data
        return await response.json();
    } catch (error) {
        // Log the error and re-throw it
        console.error('Fel vid hämtning av väderdata:', error);
        throw error;
    }
}

// Function to fetch approved time from SMHI API
async function fetchApprovedTime() {
    try {
        const response = await fetch(APPROVED_TIME_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta godkänd tid');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av godkänd tid:', error);
        throw error;
    }
}

// Function to fetch parameters from SMHI API
async function fetchParameters() {
    try {
        const response = await fetch(PARAMETERS_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta parametrar');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av parametrar:', error);
        throw error;
    }
}

// Function to fetch warnings metadata from SMHI API
async function fetchWarningsMetadata() {
    try {
        const response = await fetch(WARNINGS_METADATA_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta vädervarningsmetadata');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningsmetadata:', error);
        throw error;
    }
}

// Function to fetch warnings entry from SMHI API
async function fetchWarningsEntry() {
    try {
        const response = await fetch(WARNINGS_ENTRY_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta vädervarningar');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningar:', error);
        throw error;
    }
}

// Function to fetch warnings area from SMHI API
async function fetchWarningsArea() {
    try {
        const response = await fetch(WARNINGS_AREA_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta vädervarningsområden');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningsområden:', error);
        throw error;
    }
}

// Function to fetch warnings events from SMHI API
async function fetchWarningsEvents() {
    try {
        const response = await fetch(WARNINGS_EVENTS_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta vädervarningshändelser');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningshändelser:', error);
        throw error;
    }
}

// Function to fetch warnings levels from SMHI API
async function fetchWarningsLevels() {
    try {
        const response = await fetch(WARNINGS_LEVELS_URL);
        if (!response.ok) {
            throw new Error('Kunde inte hämta vädervarningsnivåer');
        }
        return await response.json();
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningsnivåer:', error);
        throw error;
    }
}

// Function to fetch warnings for a specific location
async function fetchWarningsForLocation(longitude, latitude) {
    try {
        // First, fetch the warnings entry
        const warningsData = await fetchWarningsEntry();
        
        // Then, fetch the area data to find the area that contains the user's location
        const areaData = await fetchWarningsArea();
        
        // Log the data to see its structure
        console.log('Warnings data for location:', warningsData);
        console.log('Area data:', areaData);
        
        // Find the area that contains the user's location
        // This is a simplified approach - in a real application, you would need to check
        // if the coordinates are within the area's boundaries
        let relevantWarnings = [];
        
        if (warningsData && warningsData.area && warningsData.area.length > 0) {
            // For each area in the warnings data
            for (const area of warningsData.area) {
                // Check if the area has warnings
                if (area.warnings && area.warnings.length > 0) {
                    // For simplicity, we'll assume that if the area exists in the warnings data,
                    // it's relevant to the user's location
                    // In a real application, you would need to check if the coordinates are within the area's boundaries
                    relevantWarnings = relevantWarnings.concat(area.warnings.map(warning => ({
                        ...warning,
                        areaName: area.name || 'Okänt område'
                    })));
                }
            }
        }
        
        // If no area-specific warnings were found, check for general warnings
        if (relevantWarnings.length === 0 && warningsData.warnings && warningsData.warnings.length > 0) {
            relevantWarnings = warningsData.warnings;
        }
        
        // If no warnings were found, check for messages
        if (relevantWarnings.length === 0 && warningsData.messages && warningsData.messages.length > 0) {
            relevantWarnings = warningsData.messages.map(message => ({
                ...message,
                isMessage: true
            }));
        }
        
        return {
            warnings: relevantWarnings,
            originalData: warningsData
        };
    } catch (error) {
        console.error('Fel vid hämtning av vädervarningar för plats:', error);
        throw error;
    }
}

// Function to get the user's current location using geolocation
async function getUserLocation() {
    try {
        // Get the user's position using the geolocation API
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // Extract longitude and latitude and round to 4 decimals
        const longitude = position.coords.longitude.toFixed(4);
        const latitude = position.coords.latitude.toFixed(4);
        
        // Set the location input field to the current coordinates
        document.getElementById('locationInput').value = `${longitude},${latitude}`;
        
        // Get the location name and weather data
        const locationName = await getLocationName(longitude, latitude);
        const weatherData = await fetchWeatherData(longitude, latitude);
        const approvedTimeData = await fetchApprovedTime();
        
        // Update the location name in the UI
        const locationNameElement = document.getElementById('locationName');
        locationNameElement.textContent = locationName;
        locationNameElement.classList.add('visible');
        
        // Update the UI with the fetched weather data
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateForecast(weatherData);
        updateApprovedTimeInfo(approvedTimeData);
        
        // Fetch and update warnings separately
        updateWarningsUI();
    } catch (error) {
        // Log the error and alert the user
        console.error('Fel vid hämtning av position:', error);
        alert('Kunde inte hämta din position. Vänligen ange koordinater manuellt.');
    }
}

// Function to search for weather data based on manually entered coordinates
async function searchWeather() {
    // Get the input value and trim whitespace
    const input = document.getElementById('locationInput').value.trim();
    // Split the input into longitude and latitude and parse as floats
    const [longitude, latitude] = input.split(',').map(coord => parseFloat(coord.trim()));
    
    // Check if the coordinates are valid numbers
    if (isNaN(longitude) || isNaN(latitude)) {
        alert('Vänligen ange giltiga koordinater i formatet: longitud,latitud');
        return;
    }
    
    try {
        // Get the location name and weather data
        const locationName = await getLocationName(longitude, latitude);
        const weatherData = await fetchWeatherData(longitude, latitude);
        const approvedTimeData = await fetchApprovedTime();
        
        // Update the location name in the UI
        const locationNameElement = document.getElementById('locationName');
        locationNameElement.textContent = locationName;
        locationNameElement.classList.add('visible');
        
        // Update the UI with the fetched weather data
        updateCurrentWeather(weatherData);
        updateHourlyForecast(weatherData);
        updateForecast(weatherData);
        updateApprovedTimeInfo(approvedTimeData);
        
        // Fetch and update warnings separately
        updateWarningsUI();
    } catch (error) {
        // Log the error and alert the user
        console.error('Fel vid hämtning av väderdata:', error);
        alert('Ett fel uppstod vid hämtning av väderdata. Vänligen försök igen.');
    }
}

// Function to get the location name from coordinates using Nominatim API
async function getLocationName(longitude, latitude) {
    try {
        // Construct the API URL with longitude and latitude
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=sv`);
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Kunde inte hämta platsnamn');
        }
        // Parse the JSON response
        const data = await response.json();
        const address = data.address;
        
        // Build a more relevant location description
        let locationParts = [];
        
        // Add suburb/neighbourhood if available
        if (address.suburb) {
            locationParts.push(address.suburb);
        } else if (address.neighbourhood) {
            locationParts.push(address.neighbourhood);
        }
        
        // Add city/town/village
        if (address.city) {
            locationParts.push(address.city);
        } else if (address.town) {
            locationParts.push(address.town);
        } else if (address.village) {
            locationParts.push(address.village);
        }
        
        // Add state if available
        if (address.state) {
            locationParts.push(address.state);
        }
        
        // If no relevant information was found, use display_name
        if (locationParts.length === 0) {
            return data.display_name.split(',')[0];
        }
        
        // Join the location parts with a comma and space
        return locationParts.join(', ');
    } catch (error) {
        // Log the error and return 'Okänd plats'
        console.error('Fel vid hämtning av platsnamn:', error);
        return 'Okänd plats';
    }
}

// Function to update the current weather section in the UI
function updateCurrentWeather(data) {
    // Extract parameters from the first time series
    const parameters = getParameters(data.timeSeries[0].parameters);
    // Get the weather icon and description
    const weatherIcon = getWeatherIcon(parameters.Wsymb2);
    const weatherDescription = getWeatherDescription(parameters.Wsymb2);
    // Get the current time
    const date = new Date(data.timeSeries[0].validTime);
    const time = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    
    // Update the header of the current weather section
    document.getElementById('currentWeather').querySelector('h2').innerHTML = `
        <i class="fas fa-sun"></i>
        Aktuellt väder
    `;
    
    // Update the content of the current weather section
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

// Function to update the hourly forecast section in the UI
function updateHourlyForecast(data) {
    // Map the first 5 hourly forecasts to HTML elements
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
    
    // Update the header of the hourly forecast section
    document.getElementById('hourlyForecast').querySelector('h2').innerHTML = `
        <i class="fas fa-clock"></i>
        Timprognos
    `;
    
    // Update the content of the hourly forecast section
    document.getElementById('hourlyForecastContent').innerHTML = hourlyForecasts;
}

// Function to update the 5-day forecast section in the UI
function updateForecast(data) {
    // Group forecasts by day
    const forecastsByDay = {};
    data.timeSeries.forEach(forecast => {
        const date = new Date(forecast.validTime);
        const dateKey = date.toLocaleDateString('sv-SE', { weekday: 'long' });
        if (!forecastsByDay[dateKey]) {
            forecastsByDay[dateKey] = forecast;
        }
    });
    
    // Map the first 5 daily forecasts to HTML elements
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
    
    // Update the header of the 5-day forecast section
    document.getElementById('forecast').querySelector('h2').innerHTML = `
        <i class="fas fa-calendar"></i>
        5-dagars prognos
    `;
    
    // Update the content of the 5-day forecast section
    document.getElementById('forecastContent').innerHTML = dailyForecasts;
}

// Function to update the approved time information in the UI
function updateApprovedTimeInfo(approvedTimeData) {
    try {
        const approvedTime = new Date(approvedTimeData.approvedTime);
        const referenceTime = new Date(approvedTimeData.referenceTime);
        
        const approvedTimeFormatted = approvedTime.toLocaleString('sv-SE');
        const referenceTimeFormatted = referenceTime.toLocaleString('sv-SE');
        
        // Create or update the approved time info element
        let approvedTimeElement = document.getElementById('approvedTimeInfo');
        if (!approvedTimeElement) {
            approvedTimeElement = document.createElement('div');
            approvedTimeElement.id = 'approvedTimeInfo';
            approvedTimeElement.className = 'approved-time-info';
            document.getElementById('currentWeather').appendChild(approvedTimeElement);
        }
        
        approvedTimeElement.innerHTML = `
            <p>Prognos godkänd: ${approvedTimeFormatted}</p>
            <p>Referenstid: ${referenceTimeFormatted}</p>
        `;
    } catch (error) {
        console.error('Fel vid uppdatering av godkänd tid:', error);
    }
}

// Function to update the warnings UI
async function updateWarningsUI() {
    try {
        // Get the user's location from the input field
        const input = document.getElementById('locationInput').value.trim();
        let longitude, latitude;
        
        if (input) {
            // Split the input into longitude and latitude and parse as floats
            [longitude, latitude] = input.split(',').map(coord => parseFloat(coord.trim()));
        } else {
            // If no location is specified, use default coordinates (e.g., Stockholm)
            longitude = 18.0686;
            latitude = 59.3293;
        }
        
        // Fetch warnings for the user's location
        const warningsData = await fetchWarningsForLocation(longitude, latitude);
        
        // Create or update the warnings element
        let warningsElement = document.getElementById('warnings');
        if (!warningsElement) {
            warningsElement = document.createElement('div');
            warningsElement.id = 'warnings';
            warningsElement.className = 'weather-section';
            warningsElement.innerHTML = '<h2><i class="fas fa-exclamation-circle"></i> Vädervarningar</h2>';
            document.getElementById('weatherInfo').appendChild(warningsElement);
        }
        
        let warningsContentElement = document.getElementById('warningsContent');
        if (!warningsContentElement) {
            warningsContentElement = document.createElement('div');
            warningsContentElement.id = 'warningsContent';
            warningsElement.appendChild(warningsContentElement);
        }
        
        // Check if there are any warnings
        if (warningsData.warnings && warningsData.warnings.length > 0) {
            const warningsHtml = warningsData.warnings.map(warning => {
                // Determine the icon based on whether it's a warning or a message
                const iconClass = warning.isMessage ? 'fa-info-circle' : 'fa-exclamation-triangle';
                const iconColor = warning.isMessage ? 'color: #2196F3;' : 'color: #FF9800;';
                
                return `
                    <div class="warning">
                        <i class="fas ${iconClass}" style="${iconColor}"></i>
                        <div>
                            <h3>${warning.title || (warning.isMessage ? 'Vädermeddelande' : 'Vädervarning')}</h3>
                            <p>${warning.description || 'Ingen beskrivning tillgänglig'}</p>
                            ${warning.areaName ? `<p><strong>Område:</strong> ${warning.areaName}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            warningsContentElement.innerHTML = warningsHtml;
        } else {
            warningsContentElement.innerHTML = '<p>Inga vädervarningar för tillfället</p>';
        }
    } catch (error) {
        console.error('Fel vid uppdatering av vädervarningar:', error);
        let warningsContentElement = document.getElementById('warningsContent');
        if (!warningsContentElement) {
            warningsContentElement = document.createElement('div');
            warningsContentElement.id = 'warningsContent';
            document.getElementById('warnings').appendChild(warningsContentElement);
        }
        warningsContentElement.innerHTML = '<p>Kunde inte hämta vädervarningar</p>';
    }
}

// Helper function to extract parameter values from the SMHI API response
function getParameters(parameters) {
    const paramMap = {};
    parameters.forEach(param => {
        paramMap[param.name] = param.values[0];
    });
    return paramMap;
}

// Helper function to get the weather icon based on the weather code
function getWeatherIcon(weatherCode) {
    return weatherIcons[weatherCode] || 'fas fa-question';
}

// Helper function to get the weather description based on the weather code
function getWeatherDescription(weatherCode) {
    return weatherDescriptions[weatherCode] || 'Okänt väder';
}

// Helper function to format a date string
function formatDate(dateString, weekdayOnly = false) {
    const date = new Date(dateString);
    if (weekdayOnly) {
        return date.toLocaleDateString('sv-SE', { weekday: 'long' });
    }
    return date.toLocaleDateString('sv-SE');
}

// Helper function to calculate air quality based on PM2.5
function getAirQuality(pm25) {
    if (pm25 <= 10) return 'Mycket bra';
    if (pm25 <= 20) return 'Bra';
    if (pm25 <= 25) return 'Acceptabel';
    if (pm25 <= 50) return 'Dålig';
    return 'Mycket dålig';
}

// Theme management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check if the user has a saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // Set the theme to the saved theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Use the system's theme setting
        const isDark = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark ? 'dark' : 'light');
    }

    // Listen for changes in the system's theme setting
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            // Update the theme if no theme is saved
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeIcon(e.matches ? 'dark' : 'light');
        }
    });

    // Handle manual theme switching
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Set the new theme and save it to local storage
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Function to update the theme icon
function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Run initTheme when the page is loaded
document.addEventListener('DOMContentLoaded', initTheme);
