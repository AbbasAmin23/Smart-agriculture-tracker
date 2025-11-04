document.addEventListener('DOMContentLoaded', () => {
    // Forms
    const addCropForm = document.getElementById('add-crop-form');
    const addSensorForm = document.getElementById('add-sensor-form');

    // Display areas
    const cropList = document.getElementById('crop-list');
    const sensorList = document.getElementById('sensor-list');
    const sensorDataDisplay = document.getElementById('sensor-data-display');

    let selectedCropId = null;

    // Fetch and display crops
    function fetchCrops() {
        fetch('../backend/crops.php')
            .then(response => response.json())
            .then(crops => {
                cropList.innerHTML = '<h4>Your Crops</h4>';
                crops.forEach(crop => {
                    const cropEl = document.createElement('div');
                    cropEl.classList.add('crop-item');
                    cropEl.innerHTML = `<span>${crop.name} (Planted: ${crop.planting_date})</span>`;
                    cropEl.addEventListener('click', () => {
                        selectedCropId = crop.id;
                        fetchSensors(); // Refresh sensor list for the selected crop
                    });
                    cropList.appendChild(cropEl);
                });
            });
    }

    // Add a new crop
    addCropForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addCropForm);
        fetch('../backend/crops.php', { method: 'POST', body: formData })
            .then(() => {
                addCropForm.reset();
                fetchCrops();
            });
    });

    // Fetch and display sensors
    function fetchSensors() {
        fetch('../backend/sensors.php')
            .then(response => response.json())
            .then(sensors => {
                sensorList.innerHTML = '<h4>Your Sensors</h4>';
                sensors.forEach(sensor => {
                    const sensorEl = document.createElement('div');
                    sensorEl.classList.add('sensor-item');
                    sensorEl.innerHTML = `<span>${sensor.name} (${sensor.type}) at ${sensor.location}</span>`;
                    sensorEl.addEventListener('click', () => {
                        if (selectedCropId) {
                            fetchSensorData(sensor.id, selectedCropId);
                        } else {
                            alert('Please select a crop first.');
                        }
                    });
                    sensorList.appendChild(sensorEl);
                });
            });
    }

    // Add a new sensor
    addSensorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addSensorForm);
        fetch('../backend/sensors.php', { method: 'POST', body: formData })
            .then(() => {
                addSensorForm.reset();
                fetchSensors();
            });
    });

    // Fetch and display sensor data
    function fetchSensorData(sensorId, cropId) {
        fetch(`../backend/sensor_data.php?sensor_id=${sensorId}&crop_id=${cropId}`)
            .then(response => response.json())
            .then(data => {
                sensorDataDisplay.innerHTML = `<canvas id="sensor-chart" width="400" height="200"></canvas>`;
                const ctx = document.getElementById('sensor-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(d => new Date(d.timestamp).toLocaleString()),
                        datasets: [{
                            label: 'Sensor Readings',
                            data: data.map(d => d.value),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            tension: 0.1
                        }]
                    }
                });
            });
    }

    // Initial fetches
    fetchCrops();
    fetchSensors();
});