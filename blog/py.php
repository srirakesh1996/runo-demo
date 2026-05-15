<?php
/**
 * Add media query after existing custom-blog-container style block
 */

$rootDir = __DIR__;

$search = '.toc-link {
    display: block;
    text-decoration: none;
    color: #111111;
    background: #f8fafc;
    border: 1px solid #edf2f7;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.45;
    transition: all 0.2s ease;
    word-break: break-word;
    margin: 3px 5px;
}
a ';

$replace = '.toc-link {
    display: block;
    text-decoration: none;
    color: #111111;
    background: #f8fafc;
    border: 1px solid #edf2f7;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.45;
    transition: all 0.2s ease;
    word-break: break-word;
    margin: 3px 5px;
}
a ';

$allowedExtensions = ['php', 'html', 'htm'];

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootDir)
);

$totalUpdated = 0;

foreach ($iterator as $file) {

    if ($file->isDir()) {
        continue;
    }

    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions)) {
        continue;
    }

    $filePath = $file->getPathname();

    $content = file_get_contents($filePath);

    if (strpos($content, $search) !== false) {

        $updatedContent = str_replace($search, $replace, $content);

        file_put_contents($filePath, $updatedContent);

        echo "Updated: {$filePath}" . PHP_EOL;

        $totalUpdated++;
    }
}

echo PHP_EOL . "Done. Total files updated: {$totalUpdated}" . PHP_EOL;

?>