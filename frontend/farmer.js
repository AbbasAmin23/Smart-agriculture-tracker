document.addEventListener('DOMContentLoaded', () => {
    const priceList = document.getElementById('price-list');
    const weatherDiv = document.getElementById('weather');

    // Fetch and display prices
    function fetchPrices() {
        fetch('../backend/prices.php')
            .then(response => response.json())
            .then(prices => {
                priceList.innerHTML = '<h3>Current Market Prices</h3>';
                prices.forEach(price => {
                    const priceEl = document.createElement('div');
                    priceEl.innerHTML = `
                        <p>${price.product_name} in ${price.region}: $${price.price} (as of ${price.date})</p>
                        <canvas id="chart-${price.product_id}" width="400" height="200"></canvas>
                    `;
                    priceList.appendChild(priceEl);
                    fetchChartData(price.product_id);
                });
            });
    }

    // Fetch 7-day price data and render chart
    function fetchChartData(productId) {
        fetch(`../backend/prices.php?product_id=${productId}`)
            .then(response => response.json())
            .then(priceData => {
                const ctx = document.getElementById(`chart-${productId}`).getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: priceData.map(d => d.date),
                        datasets: [{
                            label: 'Price Trend',
                            data: priceData.map(d => d.price),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            tooltip: {
                                mode: 'index',
                                intersect: false
                            }
                        }
                    }
                });
            });
    }

    // Mock weather data
    function fetchWeather() {
        // In a real application, this would fetch from a weather API
        const mockWeather = {
            'Islamabad': { temp: 25, condition: 'Sunny' },
            'Lahore': { temp: 30, condition: 'Cloudy' },
            'Karachi': { temp: 32, condition: 'Rainy' }
        };

        weatherDiv.innerHTML = '<h3>Regional Weather</h3>';
        for (const city in mockWeather) {
            const weather = mockWeather[city];
            const weatherEl = document.createElement('div');
            weatherEl.innerHTML = `<p>${city}: ${weather.temp}°C, ${weather.condition}</p>`;
            weatherDiv.appendChild(weatherEl);
        }
    }

    fetchPrices();
    fetchWeather();
});