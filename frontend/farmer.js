
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    fetchMarketPrices();
    fetchWeatherUpdates();
    fetchSmartAdvice();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    document.getElementById('search-bar').addEventListener('input', (e) => {
        filterMarketPrices(e.target.value);
    });
});

let allPrices = [];

async function fetchMarketPrices() {
    try {
        const response = await fetch('/api/prices');
        allPrices = await response.json();
        displayMarketPrices(allPrices);
    } catch (error) {
        console.error('Error fetching market prices:', error);
    }
}

function displayMarketPrices(prices) {
    const container = document.getElementById('price-trends-container');
    container.innerHTML = '';
    prices.forEach(price => {
        const priceCard = document.createElement('div');
        priceCard.className = 'price-card';
        priceCard.innerHTML = `
            <h3>${price.item}</h3>
            <p>Current Price: ${price.currentPrice}</p>
            <canvas id="chart-${price.id}" width="400" height="200"></canvas>
        `;
        container.appendChild(priceCard);

        const ctx = document.getElementById(`chart-${price.id}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: price.priceHistory.map(h => h.date),
                datasets: [{
                    label: 'Price Trend',
                    data: price.priceHistory.map(h => h.price),
                    borderColor: '#1abc9c',
                    tension: 0.1
                }]
            }
        });
    });
}

function filterMarketPrices(searchTerm) {
    const filteredPrices = allPrices.filter(price => 
        price.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayMarketPrices(filteredPrices);
}

async function fetchWeatherUpdates() {
    try {
        const response = await fetch('/api/weather');
        const weatherData = await response.json();
        displayWeatherUpdates(weatherData);
    } catch (error) {
        console.error('Error fetching weather updates:', error);
    }
}

function displayWeatherUpdates(weatherData) {
    const container = document.getElementById('weather-container');
    container.innerHTML = '';
    weatherData.forEach(weather => {
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <h3>${weather.city}</h3>
            <p>${weather.temperature}°C</p>
            <p>${weather.description}</p>
        `;
        container.appendChild(weatherCard);
    });
}

async function fetchSmartAdvice() {
    try {
        const response = await fetch('/api/advice');
        const advice = await response.json();
        displaySmartAdvice(advice);
    } catch (error) {
        console.error('Error fetching smart advice:', error);
    }
}

function displaySmartAdvice(advice) {
    const container = document.getElementById('advice-container');
    container.innerHTML = `<p>${advice.text}</p>`;
}
