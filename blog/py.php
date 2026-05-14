<?php
/**
 * Add inline style:
 *
 * FROM:
 * <div class="container-fluid py-2 custom-blog-container">
 *
 * TO:
 * <div class="container-fluid py-2 custom-blog-container">
 *
 * Also inserts CSS before </head>
 */

$rootDir = __DIR__;

$search = '<div class="container-fluid py-2 custom-blog-container">';

$replace = '<div class="container-fluid py-2 custom-blog-container">';

$css = '
<style>
  .custom-blog-container {
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 991.98px) {
    .custom-blog-container {
      width: 100%;
    }
  }
</style>

</head>';

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

    $originalContent = $content;

    // Replace container class
    $content = str_replace($search, $replace, $content);

    // Add CSS before </head>
    if (
        strpos($content, '.custom-blog-container') === false &&
        strpos($content, '</head>') !== false
    ) {
        $content = str_replace('</head>', $css, $content);
    }

    if ($content !== $originalContent) {

        file_put_contents($filePath, $content);

        echo "Updated: {$filePath}" . PHP_EOL;

        $totalUpdated++;
    }
}

echo PHP_EOL . "Done. Total files updated: {$totalUpdated}" . PHP_EOL;

?>