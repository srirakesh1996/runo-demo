<?php

// Function to fetch the content of a URL using cURL
function getUrlContent($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);  // Follow redirects if any
    $content = curl_exec($ch);
    curl_close($ch);
    
    return $content;
}

// Function to parse the HTML and get meta title and description
function getMetaTags($html) {
    $dom = new DOMDocument;
    @$dom->loadHTML($html); // Suppress warnings for invalid HTML (common in real-world pages)

    $metaTags = [];
    
    // Get the <title> tag (meta title)
    $title = $dom->getElementsByTagName('title');
    if ($title->length > 0) {
        $metaTags['title'] = $title->item(0)->textContent;
    } else {
        $metaTags['title'] = 'No title found';
    }
    
    // Get meta description
    $description = $dom->getElementsByTagName('meta');
    foreach ($description as $meta) {
        if ($meta->getAttribute('name') == 'description') {
            $metaTags['description'] = $meta->getAttribute('content');
        }
    }

    // If description is not found, use a fallback
    if (!isset($metaTags['description'])) {
        $metaTags['description'] = 'No description found';
    }

    return $metaTags;
}

// Function to get all URLs from your sitemap XML
function getUrlsFromSitemap($sitemapUrl) {
    $xml = simplexml_load_file($sitemapUrl);
    $urls = [];
    
    // Loop through the <url> nodes and get the <loc> content (the URL)
    foreach ($xml->url as $url) {
        $urls[] = (string)$url->loc;
    }
    
    return $urls;
}

// Your sitemap URL or path to the local XML file
$sitemapUrl = 'https://runo.ai/sitemap.xml'; // Replace with your sitemap URL or file path

// Get all URLs from the sitemap
$urls = getUrlsFromSitemap($sitemapUrl);

// Start the Excel-compatible HTML table
$output = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
$output .= '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Meta Data</x:Name>';
$output .= '<x:WorksheetOptions><x:Selected/><x:ProtectContents>False</x:ProtectContents><x:ProtectObjects>False</x:ProtectObjects><x:ProtectScenarios>False</x:ProtectScenarios></x:WorksheetOptions>';
$output .= '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
$output .= '<table border="1">';
$output .= '<tr><th>Page Name</th><th>Meta Title</th><th>Meta Description</th></tr>';

// Loop through URLs, extract meta tags and populate the Excel file
foreach ($urls as $url) {
    echo "Fetching URL: $url\n";
    
    // Get the content of the page
    $html = getUrlContent($url);
    
    // Parse and extract meta tags (title, description)
    $metaTags = getMetaTags($html);

    // Add data to the table
    $output .= '<tr>';
    $output .= '<td>' . htmlspecialchars($url) . '</td>'; // Page Name (URL)
    $output .= '<td>' . htmlspecialchars($metaTags['title']) . '</td>'; // Meta Title
    $output .= '<td>' . htmlspecialchars($metaTags['description']) . '</td>'; // Meta Description
    $output .= '</tr>';
}

// Close the table and HTML tags
$output .= '</table>';
$output .= '</body></html>';

// Set the headers to prompt a download of the file
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="meta_tags.xls"');
header('Cache-Control: max-age=0');

// Output the Excel-compatible HTML content
echo $output;

?>
