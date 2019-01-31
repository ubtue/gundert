<?php

    namespace Gundert;
    require('../inc.conf.php');

    // start session
    Session::initialize();

    // init pagetree
    if (!isset($pageId))
        $pageId = Pagetree::PAGE_DEFAULT;
    Pagetree::initPages(DIR_TPL . 'pages.xml', $pageId);

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
                $js .= "\t\t" . '"' . $id . '":"' . $text . '",' . JS_EOL;
            }
            $js .= "\t" . '},' . JS_EOL;
        }
        $js .= '};' . JS_EOL;
        file_put_contents($jsPath, $js);
    }

    // Generate Letters cache
    $lettersPath = DIR_PUBLIC_CACHE . 'letters.json';
    if (!is_file($lettersPath))
        file_put_contents($lettersPath, json_encode(Letters::GetLetters(), JSON_PRETTY_PRINT));

    // Generate XML sitemap
    $xmlSitemapPath = DIR_PUBLIC_CACHE . 'sitemap.xml';
    if (!is_file($xmlSitemapPath))
        file_put_contents($xmlSitemapPath, Pagetree::buildSitemapXml());

    // include local configuration
    $localCfgPath = DIR_BASE . 'inc.conf.local.php';
    if (is_file($localCfgPath)) {
        require($localCfgPath);
    }
