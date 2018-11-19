<?php

    namespace Gundert;
    require('../inc.conf.php');

    if (isset($_GET['id'])) {
        $search = Config::GetSearch($_GET['id']);
        if ($search) {
            header('Content-type: application/json');
            print $search->getCachedResult();
        }
    }
?>
