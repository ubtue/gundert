<?php

    namespace Gundert;

    if (isset($_GET['page'])) {
        $pageId = $_GET['page'];
    }
    require(__DIR__ . '/init.php');

    // Include CSP headers
    foreach (CSP_HEADERS as $cspHeader) {
        header('Content-Security-Policy: ' . $cspHeader);
    }

    // render selected page
    $page = Pagetree::getPage($pageId);
    Template::render($page);

?>
