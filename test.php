<?php

// Sample test values (replace with form values)
$name    = "John Doe";
$email   = "john@example.com";
$phone   = "+919876543210";
$company = "ABC Pvt Ltd";

$apiUrl = "https://api-call-crm.runo.in/integration/webhook/wb/6903012a942b3585e6cbcbb6/12c74065-93fa-4c6b-b252-d3187e12a9b3";

$payload = [
    "your_name"      => $name,
    "your_email"     => $email,
    "your_phone"     => $phone,
    "your_company"   => $company,
    "your_message"   => "test",
    "your_subject"   => "Website Lead",

    "custom_source"  => "Website"
];

// Init cURL
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

// Force JSON output
header("Content-Type: application/json");

// Show response
echo json_encode([
    "http_code"        => $httpCode,
    "curl_error"       => $curlError ?: null,
    "request_payload"  => $payload,
    "api_raw_response" => $response,
    "api_json_response"=> json_decode($response, true)
], JSON_PRETTY_PRINT);

exit;
