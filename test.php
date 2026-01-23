<?php

$apiUrl = "https://api-call-crm.runo.in/integration/webhook/wb/6903012a942b3585e6cbcbb6/12c74065-93fa-4c6b-b252-d3187e12a9b3";

/* =========================
   TEST PAYLOAD
========================= */
$payload = [
    "your_name"       => "dummy2",
    "your_email"      => "dummy2@gmail.com",
    "your_phone"      => "9198989898",
    "your_company"    => "dummy2",
    "your_message"    => "dummy2",
    "your_subject"    => "dummy2",
    "your_street"     => "dummy2",
    "your_city"       => "dummy2",
    "your_state"      => "dummy2",
    "custom_status"   => "Appointment Fixed",
    "custom_source"   => "Website"
];

$ch = curl_init($apiUrl);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 30
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

/* =========================
   DISPLAY RESPONSE
========================= */
header("Content-Type: application/json");

echo json_encode([
    "http_code" => $httpCode,
    "curl_error" => $curlError ?: null,
    "request_payload" => $payload,
    "api_response" => json_decode($response, true) ?: $response
], JSON_PRETTY_PRINT);

exit;
