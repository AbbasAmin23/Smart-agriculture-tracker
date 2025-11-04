const sensorsDiv = document.getElementById('sensors');
const newSensorForm = document.getElementById('new-sensor-form');
const cropsDiv = document.getElementById('crops');
const newCropForm = document.getElementById('new-crop-form');
const newSensorDataForm = document.getElementById('new-sensor-data-form');
const viewSensorDataForm = document.getElementById('view-sensor-data-form');
const sensorDataDiv = document.getElementById('sensor-data');

const sensorSelect = newSensorDataForm.querySelector('select[name="sensor_id"]');
const cropSelect = newSensorDataForm.querySelector('select[name="crop_id"]');
const cropSelectView = viewSensorDataForm.querySelector('select[name="crop_id_view"]');

function fetchSensors() {
    fetch('../backend/sensors.php')
        .then(response => response.json())
        .then(sensors => {
            sensorsDiv.innerHTML = '';
            sensorSelect.innerHTML = '';
            sensors.forEach(sensor => {
                const sensorElement = document.createElement('div');
                sensorElement.innerHTML = `<p>${sensor.name} (${sensor.type}) at ${sensor.location}</p>`;
                sensorsDiv.appendChild(sensorElement);

                const option = document.createElement('option');
                option.value = sensor.id;
                option.textContent = sensor.name;
                sensorSelect.appendChild(option);
            });
        });
}

function fetchCrops() {
    fetch('../backend/crops.php')
        .then(response => response.json())
        .then(crops => {
            cropsDiv.innerHTML = '';
            cropSelect.innerHTML = '';
            cropSelectView.innerHTML = '';
            crops.forEach(crop => {
                const cropElement = document.createElement('div');
                cropElement.innerHTML = `<p>${crop.name} (Planted: ${crop.planting_date}, Harvest: ${crop.harvest_date})</p>`;
                cropsDiv.appendChild(cropElement);

                const option = document.createElement('option');
                option.value = crop.id;
                option.textContent = crop.name;
                cropSelect.appendChild(option);

                const optionView = document.createElement('option');
                optionView.value = crop.id;
                optionView.textContent = crop.name;
                cropSelectView.appendChild(optionView);
            });
        });
}

newSensorForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('../backend/sensors.php', {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                newSensorForm.reset();
                fetchSensors();
            } else {
                alert(data.message);
            }
        });
});

newCropForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('../backend/crops.php', {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                newCropForm.reset();
                fetchCrops();
            } else {
                alert(data.message);
            }
        });
});

newSensorDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('../backend/sensor_data.php', {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                newSensorDataForm.reset();
            } else {
                alert(data.message);
            }
        });
});

viewSensorDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const cropId = new FormData(this).get('crop_id_view');
    fetch(`../backend/sensor_data.php?crop_id=${cropId}`)
        .then(response => response.json())
        .then(data => {
            sensorDataDiv.innerHTML = '';
            data.forEach(d => {
                const dataElement = document.createElement('div');
                dataElement.innerHTML = `<p>Value: ${d.value} at ${d.timestamp}</p>`;
                sensorDataDiv.appendChild(dataElement);
            });
        });
});

fetchSensors();
fetchCrops();