<?php

    namespace Gundert;
    require('../inc.conf.php');

    // start session
    Session::initialize();

    // switch language if necessary
    if (isset($_GET['language'])) {
        Session::setLanguage($_GET['language']);
    }

    // Generate JavaScript cache with display texts
    $jsPath = DIR_PUBLIC_CACHE . 'displaytexts.js';
    if (!is_file($jsPath)) {
        $js = 'var GundertDisplayTexts = {' . JS_EOL;
        $displayTexts = Languages::getDisplayTexts();
        foreach ($displayTexts as $language => $languageTexts) {
            $js .= "\t" . $language . ': {' . JS_EOL;
            foreach ($languageTexts as $id => $text) {
                $js .= "\t\t" . $id . ':"' . $text . '",' . JS_EOL;
            }
            $js .= "\t" . '},' . JS_EOL;
        }
        $js .= '};' . JS_EOL;
        file_put_contents($jsPath, $js);
    }

    // render selected page
    Pagetree::initPages(DIR_TPL . 'pages.xml');
    $pageId = Pagetree::PAGE_DEFAULT;
    if (isset($_GET['page'])) {
        $pageId = $_GET['page'];
    }
    $page = Pagetree::getPage($pageId);
    Template::render($page);

?>
