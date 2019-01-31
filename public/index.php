<?php

    namespace Gundert;

    if (isset($_GET['page'])) {
        $pageId = $_GET['page'];
    }
    require(__DIR__ . '/init.php');

    // render selected page
    $page = Pagetree::getPage($pageId);
    Template::render($page);

?>
