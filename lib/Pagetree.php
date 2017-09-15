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
    const PAGES =   [   'home' => ['scope', 'staff', 'acknowledgements', 'external_consultants', 'imprint'],
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
     * Build menu structure
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
                return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="{register:count_MENUOBJ}"><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
            case 2:
                return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="{register:count_MENUOBJ}"><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
            case 3:
                return '<li class="ut-nav__item ut-nav__item--level-3" data-level-count="{register:count_MENUOBJ}"><a class="ut-link ut-nav__link ut-nav__link--level-3" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a></li>';
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
                return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="{register:count_MENUOBJ}"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a><a class="ut-nav__toggle-link" tabindex="-1" role="button" aria-label="-Menü aufklappen/zuklappen"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-2">';
            case 2:
                return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="{register:count_MENUOBJ}"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page.'">'.Languages::getDisplayText($page).'</a><a class="ut-nav__toggle-link"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-3">';
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