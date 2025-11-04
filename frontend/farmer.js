document.addEventListener('DOMContentLoaded', () => {
    const priceList = document.getElementById('price-list');
    const weatherDiv = document.getElementById('weather');
    const adviceDiv = document.getElementById('advice');
    const compareForm = document.getElementById('compare-form');
    const productSelect = document.getElementById('product-select');
    const comparisonChartContainer = document.getElementById('comparison-chart-container');
    const comparisonChart = document.getElementById('comparison-chart').getContext('2d');
    let comparisonChartInstance;

    const weatherMap = L.map('weather-map').setView([30.3753, 69.3451], 5); // Centered on Pakistan
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(weatherMap);

    let allPrices = [];
    let allWeatherData = {};

    // Fetch and display prices
    function fetchPrices() {
        return fetch('../backend/prices.php')
            .then(response => response.json())
            .then(prices => {
                allPrices = prices;
                priceList.innerHTML = '<h3>Current Market Prices</h3>';
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
                populateProductSelect(uniqueProducts);
            });
    }

    function populateProductSelect(products) {
        for (const productId in products) {
            const product = products[productId];
            const option = document.createElement('option');
            option.value = product.product_id;
            option.textContent = product.product_name;
            productSelect.appendChild(option);
        }
    }

    // Fetch 7-day price data and render chart
    function fetchChartData(productId, productName) {
        return fetch(`../backend/prices.php?product_id=${productId}`)
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
                return priceData;
            });
    }

    compareForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedProductIds = Array.from(productSelect.selectedOptions).map(opt => opt.value);
        if (selectedProductIds.length < 2) {
            alert('Please select at least two products to compare.');
            return;
        }

        const promises = selectedProductIds.map(id => fetch(`../backend/prices.php?product_id=${id}`).then(res => res.json()));

        Promise.all(promises).then(results => {
            const datasets = results.map((priceData, index) => {
                const productName = productSelect.querySelector(`option[value="${selectedProductIds[index]}"]`).textContent;
                return {
                    label: productName,
                    data: priceData.map(d => d.price),
                    borderColor: `hsl(${index * 60}, 100%, 50%)`, // Assign different colors
                    tension: 0.1
                };
            });

            const labels = results[0].map(d => d.date);

            if (comparisonChartInstance) {
                comparisonChartInstance.destroy();
            }
            comparisonChartInstance = new Chart(comparisonChart, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    scales: { y: { beginAtZero: true } }
                }
            });
            comparisonChartContainer.style.display = 'block';
        });
    });

    function fetchWeather() {
        const cities = {
            'Islamabad': [33.6844, 73.0479],
            'Lahore': [31.5204, 74.3587],
            'Karachi': [24.8607, 67.0011],
            'Faisalabad': [31.4504, 73.1350],
            'Peshawar': [34.0151, 71.5249]
        };
        weatherDiv.innerHTML = '<h3>Regional Weather</h3>';

        const weatherPromises = Object.keys(cities).map(city => {
            const [lat, lon] = cities[city];
            return fetch(`../backend/weather.php?city=${city}`)
                .then(response => response.json())
                .then(data => {
                    allWeatherData[city] = data;
                    const weatherEl = document.createElement('div');
                    weatherEl.classList.add('weather-card');
                    weatherEl.innerHTML = `
                        <h4>${data.location.name}</h4>
                        <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                        <p>${data.current.temp_c}°C, ${data.current.condition.text}</p>
                    `;
                    weatherDiv.appendChild(weatherEl);

                    let color = 'green';
                    if (data.current.precip_mm > 0) color = 'blue';
                    else if (data.current.temp_c > 35) color = 'yellow';

                    const marker = L.marker([lat, lon], {
                        icon: L.divIcon({ className: `weather-icon ${color}`, html: `<img src="https:${data.current.condition.icon}">` })
                    }).addTo(weatherMap);
                    marker.bindPopup(`<b>${data.location.name}</b><br>${data.current.temp_c}°C, ${data.current.condition.text}`);
                })
                .catch(error => {
                    console.error('Error fetching weather:', error);
                    const weatherEl = document.createElement('div');
                    weatherEl.innerHTML = `<p>Could not fetch weather for ${city}.</p>`;
                    weatherDiv.appendChild(weatherEl);
                });
        });
        return Promise.all(weatherPromises);
    }

    function generateAdvice() {
        adviceDiv.innerHTML = '';

        // Weather advice
        for (const city in allWeatherData) {
            const data = allWeatherData[city];
            if (data.current.precip_mm > 0) {
                const p = document.createElement('p');
                p.textContent = `Rain expected in ${city}. Avoid watering crops today.`;
                adviceDiv.appendChild(p);
            }
            if (data.current.temp_c > 35) {
                const p = document.createElement('p');
                p.textContent = `High temperatures in ${city}. Check on heat-sensitive crops.`;
                adviceDiv.appendChild(p);
            }
        }

        // Price advice
        const productIds = [...new Set(allPrices.map(p => p.product_id))];
        productIds.forEach(id => {
            const productPrices = allPrices.filter(p => p.product_id === id).sort((a, b) => new Date(a.date) - new Date(b.date));
            if (productPrices.length >= 3) {
                const lastThree = productPrices.slice(-3);
                if (lastThree[2].price > lastThree[1].price && lastThree[1].price > lastThree[0].price) {
                    const p = document.createElement('p');
                    p.textContent = `${lastThree[2].product_name} prices are rising. Consider selling within the next two days.`;
                    adviceDiv.appendChild(p);
                } else if (lastThree[2].price < lastThree[1].price && lastThree[1].price < lastThree[0].price) {
                    const p = document.createElement('p');
                    p.textContent = `${lastThree[2].product_name} prices are falling. You may want to hold your stock.`;
                    adviceDiv.appendChild(p);
                }
            }
        });
    }

    Promise.all([fetchPrices(), fetchWeather()]).then(() => {
        generateAdvice();
    });
});