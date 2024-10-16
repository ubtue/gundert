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
    define('DIR_PUBLIC_CACHE_LETTERS', DIR_PUBLIC_CACHE . 'letters/');
    define('DIR_PUBLIC_CACHE_LETTERS_P5', DIR_PUBLIC_CACHE_LETTERS . 'P5/');
    define('DIR_PUBLIC_CACHE_LETTERS_TXT', DIR_PUBLIC_CACHE_LETTERS . 'TXT/');
    define('DIR_PUBLIC_CACHE_SEARCHES', DIR_PUBLIC_CACHE . 'searches/');
    define('DIR_PUBLIC_JS', DIR_PUBLIC . 'js/');
    define('DIR_PUBLIC_MATERIALS', DIR_PUBLIC . 'materials/');
    define('DIR_PUBLIC_LETTERS', DIR_PUBLIC_MATERIALS . 'letters/');

    // Opendigi
    define('OPENDIGI_API_ENDPOINT', 'https://opendigi.ub.uni-tuebingen.de/opendigi/api/list');
    define('OPENDIGI_API_TIMEOUT', 10); // in seconds

    // CSP headers (content security policy) to avoid XSS attacks and so on
    // unfortunately we need to use 'unsafe-inline' to be compatible with the uni-tuebingen webdesign assets
    define('CSP_NONCE', \mt_rand(0, PHP_INT_MAX));
    // Note: the CSP_NONCE is used in templates, however it will be inactive as long as it's unused in the CSP headers.
    //       (still trying to figure out why there are problems within the typo3 layout assets.)
    define('CSP_HEADERS', ['default-src \'self\' \'unsafe-inline\' https://*.uni-tuebingen.de']);

    // Cache params
    define('CACHE_EXPIRED_DELAY', 24 * 60 * 60 * 30); // 30 days (in seconds)

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
    require(DIR_LIB . 'Search.php');
    require(DIR_LIB . 'Session.php');
    require(DIR_LIB . 'Template.php');
