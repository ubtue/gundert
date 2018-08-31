<?php

    // directories (base, private)
    define('DIR_BASE', __DIR__ . '/');
    define('DIR_LANG', DIR_BASE . 'lang/');
    define('DIR_LIB', DIR_BASE . 'lib/');
    define('DIR_TPL', DIR_BASE . 'tpl/');
    define('DIR_TPL_PAGES', DIR_TPL . 'pages/');

    // directories (public)
    define('DIR_PUBLIC', DIR_BASE . 'public/');
    define('DIR_PUBLIC_CACHE', DIR_PUBLIC . 'cache/');
    define('DIR_PUBLIC_JS', DIR_PUBLIC . 'js/');
    define('DIR_PUBLIC_MATERIALS', DIR_PUBLIC . 'materials/');
    define('DIR_PUBLIC_LETTERS', DIR_PUBLIC_MATERIALS . 'letters/');
    define('DIR_PUBLIC_LETTERS_P5', DIR_PUBLIC_LETTERS . 'P5/');
    define('DIR_PUBLIC_LETTERS_TXT', DIR_PUBLIC_LETTERS . 'TXT/');

    // used line endings for generating HTML/JS
    define('HTML_EOL', PHP_EOL);
    define('JS_EOL', PHP_EOL);

    // includes
    require(DIR_LIB . 'Config.php');
    require(DIR_LIB . 'Helper.php');
    require(DIR_LIB . 'Languages.php');
    require(DIR_LIB . 'Letters.php');
    require(DIR_LIB . 'Page.php');
    require(DIR_LIB . 'Pagetree.php');
    require(DIR_LIB . 'Session.php');
    require(DIR_LIB . 'Template.php');
?>
