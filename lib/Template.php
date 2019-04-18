<?php

namespace Gundert;

class Template {

    /**
     * Create an empty template for the page (if not existing)
     *
     * @param Page $page
     */
    static public function create(Page $page) {
        if (!self::exists($page)) {
            $path = self::getPath($page);
            touch($path);
        }
    }

    /**
     * Check if the template file for the page already exists
     *
     * @param Page $page
     *
     * @return bool
     */
    static public function exists(Page $page) {
        return is_file(self::getPath($page));
    }

    /**
     * Get contents of template file for a page
     * (add container if necessary)
     *
     * @param Page $page
     *
     * @return string
     */
    static public function getContents(Page $page) {
        $contents = file_get_contents(self::getPath($page));
        if ($page->isContainer()) {
            $contents = '<div class="container">' . $contents . '</div>';
        }
        return $contents;
    }

    /**
     * Get URL to alternate language for the current page
     *
     * @param string $code
     */
    static private function _getAlternateLanguageUrl($code) {
        $queryBase = preg_replace('"&?language=[a-z]+&?"i', '', $_SERVER['QUERY_STRING']);
        $url = '/';

        if ($queryBase != '')
            $url .= '?' . $queryBase . '&language=' . urlencode($code);
        else
            $url .= '?language=' . urlencode($code);

        return $url;
    }

    /**
     * Get snippet of links with hreflang attributes for SEO
     *
     * @return string
     */
    static private function _getHreflangsSnippet() {
        $snippet = '';
        foreach (Languages::CODES as $code) {
            $url = self::_getAlternateLanguageUrl($code);
            $snippet .= '<link rel="alternate" lang="' . $code . '" hreflang="' . $url .  '"/>';
        }
        return $snippet;
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
     * Get matomo snippet
     *
     * @return string
     */
    static private function _getMatomoSnippet() {
        $snippet = '<!-- Matomo disabled -->';
        if (Config::IsMatomoEnabled()) {
            $snippet = file_get_contents(DIR_PUBLIC_JS . 'matomo.js');
        }
        return $snippet;
    }

    /**
     * Get path of the template file for a page
     * (also consider interface language)
     *
     * @param Page $page
     *
     * @return string
     */
    static public function getPath(Page $page) {
        $language = Session::getLanguage();

        $pathLanguage = DIR_TPL_PAGES . $page->getId() . '-' . $language . '.phtml';
        if (is_file($pathLanguage)) {
            return $pathLanguage;
        }

        $pathDefault = DIR_TPL_PAGES . $page->getId() . '.phtml';
        return $pathDefault;
    }

    /**
     * Render the whole website including the given page template.
     * The page template should contain areas and markers, similar to typo3 templates.
     *
     * @param Page $page
     */
    static public function render(Page $page=null) {
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
     * @param Page $page
     * @param string $contents
     */
    static private function _renderAreas(Page $page, &$contents) {
        // setup areas
        $areas =    [   'TOPNAV'        => Pagetree::buildMenu()];

        $areas['CONTENTMIDDLE'] = '';
        if ($page != null) {
            if (self::exists($page)) {
                $areas['CONTENTMIDDLE'] = self::getContents($page);
            } else {
                $children = $page->getChildren();
                foreach ($children as $child) {
                    $child_contents = self::getContents($child);
                    self::_renderMarkers($child, $child_contents);
                    $areas['CONTENTMIDDLE'] .= $child_contents;
                }
            }
        }

        $footer = new Page('footer', 0, 0);
        if (self::exists($footer)) {
            $areas['FOOTER'] = self::getContents($footer);
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
     * @param Page $page
     * @param string $contents
     */
    static private function _renderMarkers(Page $page, &$contents) {
        // setup markers
        $markers =  [   'BREADCRUMB'                => implode(' &gt; ', Pagetree::getBreadcrumbPath($page, true)),
                        'LANGUAGE_CODE'             => Session::getLanguage(),
                        'LANGUAGE_CODE_LOWER'       => mb_strtolower(Session::getLanguage()),
                        'LANGUAGE_CODE_UPPER'       => mb_strtoupper(Session::getLanguage()),
                        'LANGUAGE_UID'              => Languages::UIDS[Session::getLanguage()],
                        'MATOMO'                    => self::_getMatomoSnippet(),
                        'PAGE_ID'                   => $page->getId(),
                        'PAGE_TITLE'                => Languages::getDisplayText($page->getId()),
                        'SEO-HREFLANGS'             => self::_getHreflangsSnippet(),
                        'SITEMAP'                   => Pagetree::buildSitemapHtml(),
        ];

        foreach (Languages::CODES as $code) {
            $markers['LANGUAGE_PICKER_' . mb_strtoupper($code)] = self::_getAlternateLanguageUrl($code);
        }

        // perform replacing
        foreach ($markers as $key => $value) {
            $contents = preg_replace('"###'.$key.'###"', $value, $contents);
        }

        // special markers for displaytexts
        preg_match_all('"###DT-([^#]+)###"', $contents, $hits);
        foreach ($hits[1] as $i => $displayTextKey) {
            $displayText = Languages::getDisplayText($displayTextKey);
            $contents = str_replace($hits[0][$i], $displayText, $contents);
        }
    }
}
