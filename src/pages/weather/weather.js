
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

const API_KEY = '8b6e40f2bc4142c4ba8172326252110';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

searchBtn.addEventListener('click', searchWeather);

// Также поиск по Enter
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

async function searchWeather() {
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showError('Введите название города');
        return;
    }
    
    weatherResult.innerHTML = '<div class="loading">🔍 Ищем погоду для ' + cityName + '...</div>';
    
    try {
        await fetchWeather(cityName);
    } catch (error) {
        console.error('Ошибка:', error);
        showError(error.message || 'Не удалось получить данные о погоде. Проверьте название города.');
    }
}

async function fetchWeather(cityName) {
    const url = `${API_URL}&q=${encodeURIComponent(cityName)}&lang=ru`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('Город не найден. Проверьте правильность написания.');
        } else if (response.status === 401) {
            throw new Error('Неверный API ключ. Проверьте настройки.');
        } else if (response.status === 403) {
            throw new Error('Доступ запрещен. Проверьте API ключ.');
        } else {
            throw new Error('Ошибка сервера. Попробуйте позже.');
        }
    }
    
    const data = await response.json();
    displayWeather(data);
}

function displayWeather(data) {
    const location = data.location;
    const current = data.current;
    
    const temperature = Math.round(current.temp_c);
    
    const weatherIcon = current.condition.icon;
    const weatherDescription = current.condition.text;
    
    const observationTime = new Date(current.last_updated).toLocaleString('ru-RU');
    
    const html = `
        <div class="weather-card">
            <div class="weather-main">
                <h2>${location.name}, ${location.country}</h2>
                <div>
                    <div>Обновлено: ${observationTime}</div>
                    <div>Регион: ${location.region || 'Не указан'}</div>
                </div>

                <div class="temperature-section">
                    <div class="temperature">${temperature}°C</div>
                    <div class="feels-like">
                        Ощущается как: ${Math.round(current.feelslike_c)}°C
                    </div>
                    <div class="weather-description">
                        <img src="https:${weatherIcon}" alt="${weatherDescription}" class="weather-icon-img">
                        <span>${weatherDescription}</span>
                    </div>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="value">Ветер: ${getWindDirection(current.wind_degree)}, ${current.wind_kph} км/ч</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Влажность: ${current.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Давление: ${current.pressure_mb} hPa</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Видимость: ${current.vis_km} км</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Облачность: ${current.cloud}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Часовой пояс: ${location.tz_id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="value">Координаты: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="api-info">
                <p>Данные предоставлены WeatherAPI</p>
            </div>
        </div>
    `;
    
    weatherResult.innerHTML = html;
}

function getWindDirection(degrees) {
    if (!degrees) return 'Не указано';
    
    const directions = ['Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 'Южный', 'Юго-западный', 'Западный', 'Северо-западный'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index] + ` (${degrees}°)`;
}

function showError(message) {
    weatherResult.innerHTML = `<div class="error-message">${message}</div>`;
}
