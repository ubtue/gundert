<?php

    namespace Gundert;
    require('../inc.conf.php');

    if (isset($_GET['id'])) {
        $search_id = $_GET['id'];
        $search = Config::GetSearch($search_id);
        if (!$search) {
            http_response_code('404');
            print 'Invalid search id: "' . $search_id . '"';
        } else {
            $result = $search->getCachedResult();
            if (!$result) {
                http_response_code('504');
                print 'SORRY! The external information could not be received, please try again later.';
            } else {
                header('Content-type: application/json');
                print $result;
            }
        }
    }
?>
