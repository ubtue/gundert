<?php

namespace Gundert;

class Template {

    /**
     * Create an empty template for the page (if not existing)
     *
     * @param string $page
     */
    static public function create($page) {
        if (!self::exists($page)) {
            $path = self::getPath($page);
            touch($path);
        }
    }

    /**
     * Check if the template file for the page already exists
     *
     * @param string $page
     *
     * @return bool
     */
    static public function exists($page) {
        return is_file(self::getPath($page));
    }

    /**
     * Get contents of template file for a page
     *
     * @param string $page
     *
     * @return string
     */
    static public function getContents($page) {
        return file_get_contents(self::getPath($page));
    }

    /**
     * Get contents of main template
     */
    static private function _getMainContents() {
        return file_get_contents(self::_getMainPath());
    }

    /**
     * Get path to main template
     *
     * @return string
     */
    static private function _getMainPath() {
        return DIR_TPL . 'index.phtml';
    }

    /**
     * Get path of the template file for a page
     * (also consider interface language)
     *
     * @param string $page
     *
     * @return string
     */
    static public function getPath($page) {
        $language = Session::getLanguage();
        $pathDefault = DIR_TPL_PAGES . $page . '.phtml';
        if ($language != Languages::CODE_DEFAULT) {
            $pathLanguage = DIR_TPL_PAGES . $page . '-' . $language . '.phtml';
            if (is_file($pathLanguage)) {
                return $pathLanguage;
            }
        }
        return $pathDefault;
    }

    /**
     * Render the whole website including the given page template.
     * The page template should contain areas and markers, similar to typo3 templates.
     *
     * @param string $page
     */
    static public function render($page=null) {
        // get raw template content
        $contents = self::_getMainContents();

        // fill template
        self::_renderAreas($page, $contents);
        self::_renderMarkers($page, $contents);

        // deliver
        print $contents;
    }

    /**
     * Replace template areas with generated content
     * <!-- ###AREA### Start --><!-- ###AREA### End -->
     *
     * @param string $page
     * @param string $contents
     */
    static private function _renderAreas($page, &$contents) {
        // setup areas
        $areas =    [   'TOPNAV'        => Pagetree::buildMenu()];

        if ($page != null && self::exists($page)) {
            $areas['CONTENTMIDDLE'] = self::getContents($page);
        } else {
            $areas['CONTENTMIDDLE'] = '';
        }

        // replace areas
        foreach ($areas as $key => $value) {
            $contents = preg_replace('"<!-- ###'.$key.'### Start -->(.*)<!-- ###'.$key.'### End -->"s', $value, $contents);
        }
    }

    /**
     * Replace template markers with generated content
     * ###MARKER###
     *
     * @param string $page
     * @param string $contents
     */
    static private function _renderMarkers($page, &$contents) {
        // setup markers
        $markers =  [   'BREADCRUMB'                => implode(' &gt; ', Pagetree::getBreadcrumbPath($page, true)),
                        'LANGUAGE_PICKER_DE'        => '?language=' . urlencode(Languages::CODE_DE) . '&page=' . urlencode($page),
                        'LANGUAGE_PICKER_EN'        => '?language=' . urlencode(Languages::CODE_EN) . '&page=' . urlencode($page),
                        'LANGUAGE_CODE'             => Session::getLanguage(),
        ];

        // perform replacing
        foreach ($markers as $key => $value) {
            $contents = preg_replace('"###'.$key.'###"', $value, $contents);
        }
    }
}