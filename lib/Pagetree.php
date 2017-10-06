<?php

namespace Gundert;
class Pagetree {
    /**
     * Default page, shown if no other page is selected
     */
    const PAGE_DEFAULT = 'home';

    /**
     * array with page tree, used for breadcrumbs and menu structure
     * @var array
     */
    const PAGES =   [   'home' => ['scope', 'staff', 'acknowledgements', 'imprint'],
                        'materials' => ['printed_all', 'manuscripts_all', 'publications'],
                        'material_by_language' => [ 'malayalam' => ['malayalam_print', 'malayalam_manuscript'],
                                                    'kannada' => ['kannada_print', 'kannada_manuscript'],
                                                    'tamil' => ['tamil_print', 'tamil_manuscript'],
                                                    'telugu' => ['telugu_print', 'telugu_manuscript'],
                                                    'german' => ['german_print', 'german_manuscript'],
                                                    'english' => ['english_print', 'english_manuscript'],
                                                ],
                        'material_by_genre' => ['prose', 'proverbs', 'grammars_and_dictionaries', 'religious_works', 'notebooks_and_drafts', 'records_archive'],
                        'activities',
                        'links' => ['digital_catalogue', 'digital_humanities_tools', 'etexts'],
                    ];

    /**
     * Build menu HTML structure
     *
     * @return string
     */
    static public function buildMenu() {
        $menu = '<ul class="ut-nav__list ut-nav__list--level-1">';
        $menu .= self::iterate2('self::_buildMenuNoChildren', 'self::_buildMenuChildrenStart', 'self::_buildMenuChildrenEnd');
        $menu .= '</ul>';
        return $menu;
    }

    /**
     * Build a menu entry for an element without children (callback)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string       HTML code for the menu entry
     * @throws Exception
     */
    static private function _buildMenuNoChildren($page, $level) {
        switch ($level) {
            case 1:
                return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="'.self::getPageSiblingNumber($page).'"><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
            case 2:
                return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="'.self::getPageSiblingNumber($page).'"><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
            case 3:
                return '<li class="ut-nav__item ut-nav__item--level-3" data-level-count="'.self::getPageSiblingNumber($page).'"><a class="ut-link ut-nav__link ut-nav__link--level-3" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
            default:
                throw new Exception('menu level ' . $level . ' cannot be rendered');
        }
    }

    /**
     * Build start block for a menu element with children (callback before children)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string
     * @throws Exception
     */
    static private function _buildMenuChildrenStart($page, $level) {
        switch ($level) {
            case 1:
                return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="'.self::getPageSiblingNumber($page).'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a><a class="ut-nav__toggle-link" tabindex="-1" role="button" aria-label="-Menü aufklappen/zuklappen"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-2">';
            case 2:
                return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="'.self::getPageSiblingNumber($page).'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a><a class="ut-nav__toggle-link"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-3">';
            default:
                throw new Exception('menu level ' . $level . ' cannot be rendered with children');
        }
    }

    /**
     * Build start block for a menu element with children (callback after children)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string
     * @throws Exception
     */
    static private function _buildMenuChildrenEnd($page, $level) {
        switch ($level) {
            case 1:
                return '</ul></li>';
            case 2:
                return '</ul></li>';
            default:
                throw new Exception('menu level ' . $level . ' cannot be rendered with children');
        }
    }

    /**
     * Build sitemap HTML structure
     *
     * @return string
     */
    static public function buildSitemap() {
        $sitemap = '<nav class="ut-nav ut-nav--vertical">';
        $sitemap .= '<ul id="ut-identifier--nav-vertical" class="ut-nav__list collapse">';
        $sitemap .= self::iterate2('self::_buildSitemapNoChildren', 'self::_buildSitemapChildrenStart', 'self::_buildSitemapChildrenEnd');
        $sitemap .= '</ul>';
        $sitemap .= '</nav>';
        return $sitemap;
    }

    /**
     * Build a sitemap entry for an element without children (callback)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string       HTML code for the menu entry
     */
    static private function _buildSitemapNoChildren($page, $level) {
        return '<li class="ut-nav__item" data-level-count="'.self::getPageSiblingNumber($page).'"><a class="ut-link ut-nav__link" href="?page='.$page.'">' . Languages::getDisplayText($page) . '</a></li>';
    }

    /**
     * Build start block for a sitemap element with children (callback before children)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string
     */
    static private function _buildSitemapChildrenStart($page, $level) {
        return '<li class="ut-nav__item" data-level-count="'.self::getPageSiblingNumber($page).'"><a class="ut-link ut-nav__link" href="?page='.$page.'">' . Languages::getDisplayText($page) . '</a></li><ul>';
    }

    /**
     * Build start block for a sitemap element with children (callback after children)
     *
     * @param string $page  name of the page
     * @param int $level    level of the page
     *
     * @return string
     */
    static private function _buildSitemapChildrenEnd($page, $level) {
        return '</ul>';
    }

    /**
     * Create empty templates for all pages that dont exist yet
     */
    static public function createTemplates() {
        self::iterate('self::_createTemplate');
    }

    /**
     * Create empty template if the page doesnt exist yet (callback function)
     *
     * @param string $page
     * @param int $level
     * @param bool $has_children
     */
    static private function _createTemplate($page, $level, $has_children) {
        Template::create($page);
    }

    /**
     * Get page path (e.g. for breadcrumb)
     *
     * @param string $page
     * @param bool $localized   translated page names?
     *
     * @return array
     */
    static public function getBreadcrumbPath($page, $localized=false) {
        $return = [];
        self::_getBreadcrumbPath($page, self::PAGES, $return);
        $return = array_reverse($return);

        if ($localized) {
            $return2 = [];
            foreach ($return as $page) {
                $return2[] = Languages::getDisplayText($page);
            }
            $return = $return2;
        }

        return $return;
    }

    /**
     * Helper function for recursion
     *
     * @param string $page
     * @param array $subtree
     * @param array &$return
     * @return boolean
     */
    static private function _getBreadcrumbPath($page, $subtree, &$return) {
        foreach ($subtree as $key => $value) {
            if (is_array($value)) {
                if ($key == $page) {
                    $return[] = $key;
                    return true;
                } elseif (self::_getBreadcrumbPath($page, $value, $return)) {
                    $return[] = $key;
                    return true;
                }
            } elseif ($page == $value) {
                $return[] = $value;
                return true;
            }
        }
        return false;
    }

    /**
     * Get children of the given page (empty array if none)
     *
     * @return array
     */
    static public function getChildren($page) {
        return self::_getChildren($page, self::PAGES);
    }

    /**
     * recursion: find children of the page inside the subtree
     *
     * @param string $page
     * @param array $subtree
     *
     * @return array
     */
    static private function _getChildren($page, $subtree) {
        foreach ($subtree as $key => $value) {
            if ($key === $page) {
                return $value;
            } elseif ($value === $page) {
                return [];
            } elseif (is_array($value)) {
                $children = self::_getChildren($page, $value);
                if (count($children) > 0) {
                    return $children;
                }
            }
        }

        return [];
    }

    /**
     * Get list of page and all siblings
     *
     * @param string $page
     *
     * @return array
     */
    static public function getPageSiblings($page) {
        $pagePath = array_reverse(self::getBreadCrumbPath($page));
        $subtree = self::PAGES;
        do {
            $page = array_pop($pagePath);
            if (count($pagePath) > 0) {
                $subtree = $subtree[$page];
            }
        } while (count($pagePath) > 0);

        $siblings = array();
        foreach ($subtree as $key => $value) {
            if (is_array($value)) {
                $siblings[] = $key;
            } else {
                $siblings[] = $value;
            }
        }

        return $siblings;

    }

    /**
     * Get number of the page inside the current level of its parent
     */
    static public function getPageSiblingNumber($page) {
        $siblings = self::getPageSiblings($page);
        $i=0;
        foreach ($siblings as $sibling) {
            $i++;
            if ($sibling == $page) {
                return $i;
            }
        }
    }

    /**
     * Iteration over pagetree with single callback for each page
     * @param string $callback
     */
    static public function iterate($callback) {
        return self::_iterate(self::PAGES, 1, $callback);
    }

    /**
     * Recursive helper function for iterations (single callback)
     *
     * @param array $subtree
     * @param int $level
     * @param function $callback
     *
     * @return string
     */
    static private function _iterate($subtree, $level, $callback) {
        $return = '';
        foreach ($subtree as $key => $value) {
            if (is_array($value)) {
                $return .= call_user_func($callback, $key, $level, true);
                $return .= self::_iterate($value, $level+1, $callback);
            } else {
                $return .= call_user_func($callback, $value, $level, false);
            }
        }
        return $return;
    }

    /**
     * Iteration over pagetree with several callbacks for each element,
     * dependant on whether an element has children or not
     *
     * @param function $callbackNoChildren
     * @param function $callbakChildrenStart
     * @param function $callbackChildrenEnd
     *
     * @return string
     */
    static public function iterate2($callbackNoChildren, $callbakChildrenStart, $callbackChildrenEnd) {
        return self::_iterate2(self::PAGES, 1, $callbackNoChildren, $callbakChildrenStart, $callbackChildrenEnd);
    }

    /**
     * Recursive helper function for iterations (multiple callbacks)
     *
     * @param array $subtree
     * @param int $level
     * @param function $callbackNoChildren
     * @param function $callbakChildrenStart
     * @param function $callbackChildrenEnd
     *
     * @return string
     */
    static private function _iterate2($subtree, $level, $callbackNoChildren, $callbakChildrenStart, $callbackChildrenEnd) {
        $return = '';
        foreach ($subtree as $key => $value) {
            if (is_array($value)) {
                $return .= call_user_func($callbakChildrenStart, $key, $level);
                $return .= self::_iterate2($value, $level+1, $callbackNoChildren, $callbakChildrenStart, $callbackChildrenEnd);
                $return .= call_user_func($callbackChildrenEnd, $key, $level);
            } else {
                $return .= call_user_func($callbackNoChildren, $value, $level);
            }
        }
        return $return;
    }
}
