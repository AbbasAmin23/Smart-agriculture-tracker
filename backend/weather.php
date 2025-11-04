<?php

if (isset($_GET['city'])) {
    $city = $_GET['city'];
    $api_key = '4de75602cb13439c82f55852250411'; // Replace with your actual API key
    $url = "http://api.weatherapi.com/v1/current.json?key={$api_key}&q={$city}";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
}

?>