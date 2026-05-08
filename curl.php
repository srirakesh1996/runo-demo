<?php

$url = "https://api.hsforms.com/submissions/v3/integration/submit/245018807/bf1da384-b3a2-4ed5-895d-d234d34eb62b";

$data = [
    "fields" => [
        [
            "objectTypeId" => "0-1",
            "name" => "firstname",
            "value" => "Rakesh test"
        ],
        [
            "objectTypeId" => "0-1",
            "name" => "lastname",
            "value" => "test"
        ],
        [
            "objectTypeId" => "0-1",
            "name" => "email",
            "value" => "rakesh.test123@gmail.com"
        ],
        [
            "objectTypeId" => "0-1",
            "name" => "phone",
            "value" => "+919999999999"
        ],
        [
            "objectTypeId" => "0-1",
            "name" => "company",
            "value" => "Runo CRM TEST"
        ],
        [
            "objectTypeId" => "0-1",
            "name" => "no_of_calling_agents",
            "value" => "10"
        ]
    ],
    "context" => [
        "pageUri" => "https://runo.ai/test",
        "pageName" => "Request Demo"
    ]
];

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch);
} else {
    echo "HTTP Status Code: " . $httpCode . "<br><br>";
    echo "Raw Response:<br><pre>";
    print_r($response);
    echo "</pre><br>";

    echo "Decoded Response:<br><pre>";
    print_r(json_decode($response, true));
    echo "</pre>";
}

curl_close($ch);

?>