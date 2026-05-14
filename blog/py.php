<?php
/**
 * Replace:
 * <div class="toc-card sticky-top" style="top: 110px">
 *
 * With:
 * <div class="toc-card sticky-top" style="top: 110px">
 */

$rootDir = __DIR__;

$search = '<div class="toc-card sticky-top" style="top: 110px">';

$replace = '<div class="toc-card sticky-top" style="top: 110px">';

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