<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

/**
 * Load DOM
 */
function loadDOM($html)
{
    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
    libxml_clear_errors();
    return $dom;
}

/**
 * Get Title
 */
function getTitle($dom)
{
    $titles = $dom->getElementsByTagName('title');
    return $titles->length ? trim($titles->item(0)->nodeValue) : '';
}

/**
 * Get Meta Description
 */
function getMetaDescription($dom)
{
    $metaTags = $dom->getElementsByTagName('meta');
    foreach ($metaTags as $meta) {
        if (strtolower($meta->getAttribute('name')) === 'description') {
            return trim($meta->getAttribute('content'));
        }
    }
    return '';
}

/**
 * Get Featured Image
 */
function getFeaturedImage($dom)
{
    $images = $dom->getElementsByTagName('img');

    foreach ($images as $img) {
        if (strpos($img->getAttribute('class'), 'blog-feat') !== false) {
            return trim($img->getAttribute('src'));
        }
    }

    return '';
}

/**
 * Get Published Date
 */
function getPublishedDate($dom)
{
    $xpath = new DOMXPath($dom);
    $nodes = $xpath->query("//*[contains(text(),'Published Date')]");

    foreach ($nodes as $node) {

        if (preg_match('/Published Date\s*:\s*(.*)/i', $node->textContent, $match)) {

            $dateStr = trim($match[1]);
            $timestamp = strtotime($dateStr);

            if ($timestamp) {
                return date('Y-m-d', $timestamp);
            }
        }
    }

    return '';
}

/**
 * Extract FAQs
 */
function extractFAQs($dom)
{
    $faqs = [];
    $xpath = new DOMXPath($dom);
    $h2s = $xpath->query('//h2');

    foreach ($h2s as $h2) {

        if (strpos(strtolower($h2->textContent), 'faq') !== false) {

            $node = $h2->nextSibling;

            while ($node) {

                if ($node->nodeName === 'h2') break;

                if ($node->nodeName === 'h3') {

                    $question = trim($node->textContent);

                    $next = $node->nextSibling;
                    while ($next && $next->nodeType !== 1) {
                        $next = $next->nextSibling;
                    }

                    if ($next && $next->nodeName === 'p') {
                        $answer = trim($next->textContent);

                        if ($question && $answer) {
                            $faqs[] = [
                                "q" => $question,
                                "a" => $answer
                            ];
                        }
                    }
                }

                $node = $node->nextSibling;

                if (count($faqs) >= 5) break;
            }
        }
    }

    return $faqs;
}

/**
 * Clean JSON
 */
function clean($str)
{
    return addslashes(trim($str));
}

// CONFIG
$folder = __DIR__ . '/blog';
$baseURL = "https://runo.ai/";

if (!is_dir($folder)) die("❌ Blog folder not found");

$files = glob($folder . '/*.html');
if (!$files) die("❌ No blog files found");

// =====================
// SORT BLOGS BY DATE
// =====================
$blogData = [];

foreach ($files as $file) {

    if (basename($file) == 'index.html') continue;

    $html = file_get_contents($file);
    if (!$html) continue;

    $dom = loadDOM($html);
    $date = getPublishedDate($dom);

    $timestamp = $date ? strtotime($date) : 0;

    $blogData[] = [
        'file' => $file,
        'timestamp' => $timestamp
    ];
}

// Sort latest → oldest
usort($blogData, function ($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

echo "<h2>Total Blogs: " . count($blogData) . "</h2>";

// =====================
// GENERATE SCHEMA
// =====================
foreach ($blogData as $item) {

    $file = $item['file'];

    $html = file_get_contents($file);
    if (!$html) continue;

    $dom = loadDOM($html);

    $title = getTitle($dom);
    $desc  = getMetaDescription($dom);
    $img   = getFeaturedImage($dom);
    $date  = getPublishedDate($dom);
    $faqs  = extractFAQs($dom);

    if ($img && !preg_match('/^https?:\/\//', $img)) {
        $img = $baseURL . ltrim($img, '/');
    }
$slug = basename($file, '.html');
$url = $baseURL . "blog/" . $slug;

    echo "<hr>";
    echo "<h3>FILE: " . basename($file) . "</h3>";

    // FAQ JSON
    if (!empty($faqs)) {

        $faqJson = '{
"@type":"FAQPage",
"mainEntity":[';

        foreach ($faqs as $i => $faq) {

            $faqJson .= '{
"@type":"Question",
"name":"' . clean($faq['q']) . '",
"acceptedAnswer":{"@type":"Answer","text":"' . clean($faq['a']) . '"}
}';

            if ($i < count($faqs) - 1) $faqJson .= ",";
        }

        $faqJson .= ']}';
    } else {
        $faqJson = '{
"@type":"FAQPage",
"mainEntity":[
{
"@type":"Question",
"name":"ADD_FAQ_QUESTION_1",
"acceptedAnswer":{"@type":"Answer","text":"ADD_FAQ_ANSWER_1"}
}
]}';
    }

    // FINAL SCHEMA
    $schema = '<script type="application/ld+json">
{
"@context":"https://schema.org",
"@graph":[

{
"@type":"Article",
"headline":"' . clean($title) . '",
"description":"' . clean($desc) . '",
"image":"' . $img . '",
"author":{"@type":"Person","name":"Runo Team"},
"publisher":{
"@type":"Organization",
"name":"Runo",
"logo":{
"@type":"ImageObject",
"url":"https://runo.ai/img/logo.png"
}
},
"datePublished":"' . $date . '",
"dateModified":"' . $date . '",
"mainEntityOfPage":{"@type":"WebPage","@id":"' . $url . '"}
},

' . $faqJson . '

]
}
</script>';

    echo '<textarea style="width:100%;height:320px;">' . $schema . '</textarea>';
}
