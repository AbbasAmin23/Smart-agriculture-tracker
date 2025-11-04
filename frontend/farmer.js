document.addEventListener('DOMContentLoaded', () => {
    const priceList = document.getElementById('price-list');
    const weatherDiv = document.getElementById('weather');

    // Fetch and display prices
    function fetchPrices() {
        fetch('../backend/prices.php')
            .then(response => response.json())
            .then(prices => {
                priceList.innerHTML = '<h3>Current Market Prices</h3>';
                // Create a unique list of products to avoid duplicate charts
                const uniqueProducts = {};
                prices.forEach(price => {
                    if (!uniqueProducts[price.product_id]) {
                        uniqueProducts[price.product_id] = price;
                    }
                });

                for (const productId in uniqueProducts) {
                    const price = uniqueProducts[productId];
                    const priceEl = document.createElement('div');
                    priceEl.innerHTML = `
                        <p>${price.product_name} in ${price.region}: $${price.price} (as of ${price.date})</p>
                        <canvas id="chart-${price.product_id}" width="400" height="200"></canvas>
                    `;
                    priceList.appendChild(priceEl);
                    fetchChartData(price.product_id, price.product_name);
                }
            });
    }

    // Fetch 7-day price data and render chart
    function fetchChartData(productId, productName) {
        fetch(`../backend/prices.php?product_id=${productId}`)
            .then(response => response.json())
            .then(priceData => {
                const ctx = document.getElementById(`chart-${productId}`).getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: priceData.map(d => d.date),
                        datasets: [{
                            label: `Price Trend for ${productName}`,
                            data: priceData.map(d => d.price),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.1
                        }]
                    }
                });
            });
    }

    // Fetch weather data
    function fetchWeather() {
        const cities = ['Islamabad', 'Lahore', 'Karachi', 'Faisalabad', 'Peshawar'];
        weatherDiv.innerHTML = '<h3>Regional Weather</h3>';

        cities.forEach(city => {
            fetch(`../backend/weather.php?city=${city}`)
                .then(response => response.json())
                .then(data => {
                    const weatherEl = document.createElement('div');
                    weatherEl.classList.add('weather-card'); // for styling
                    weatherEl.innerHTML = `
                        <h4>${data.location.name}</h4>
                        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                        <p>${data.current.temp_c}°C, ${data.current.condition.text}</p>
                    `;
                    weatherDiv.appendChild(weatherEl);
                })
                .catch(error => {
                    console.error('Error fetching weather:', error);
                    const weatherEl = document.createElement('div');
                    weatherEl.innerHTML = `<p>Could not fetch weather for ${city}. Please check the API key in backend/weather.php.</p>`;
                    weatherDiv.appendChild(weatherEl);
                });
        });
    }

    fetchPrices();
    fetchWeather();
});