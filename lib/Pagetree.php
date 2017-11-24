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
    static $_pages;

    /**
     * Id with page id to search for (for getPage callback)
     * @var int
     */
    static $_callbackPageId;

    /**
     * Result with found Page object (for getPage callback)
     * @var Page
     */
    static $_callbackResult;

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
     * @param Page $page    page object
     *
     * @return string       HTML code for the menu entry
     * @throws Exception
     */
    static private function _buildMenuNoChildren(Page $page) {
        switch ($page->getLevel()) {
            case 1:
                return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="'.$page->getSiblingNumber().'"><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page->getId().'">'.Languages::getDisplayText($page->getId()).'</a></li>';
            case 2:
                return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="'.$page->getSiblingNumber().'"><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page->getId().'">'.Languages::getDisplayText($page->getId()).'</a></li>';
            case 3:
                return '<li class="ut-nav__item ut-nav__item--level-3" data-level-count="'.$page->getSiblingNumber().'"><a class="ut-link ut-nav__link ut-nav__link--level-3" href="?page='.$page->getId().'">'.Languages::getDisplayText($page->getId()).'</a></li>';
            default:
                throw new \Exception('menu level ' . $page->getLevel() . ' cannot be rendered');
        }
    }

    /**
     * Build start block for a menu element with children (callback before children)
     *
     * @param Page $page    page object
     *
     * @return string
     * @throws Exception
     */
    static private function _buildMenuChildrenStart(Page $page) {
        switch ($page->getLevel()) {
            case 1:
                if ($page->isCallable()) {
                    return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="'.$page->getSiblingNumber().'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-1" href="?page='.$page->getId().'">'.Languages::getDisplayText($page->getId()).'</a><a class="ut-nav__toggle-link" tabindex="-1" role="button" aria-label="-Menü aufklappen/zuklappen"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-2">';
                } else {
                    return '<li class="ut-nav__item ut-nav__item--level-1" data-level-count="'.$page->getSiblingNumber().'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-1 ut-nav__link--is-disabled">'.Languages::getDisplayText($page->getId()).'</a><a class="ut-nav__toggle-link" tabindex="-1" role="button" aria-label="-Menü aufklappen/zuklappen"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-2">';
                }
            case 2:
                if ($page->isCallable()) {
                    return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="'.$page->getSiblingNumber().'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-2" href="?page='.$page->getId().'">'.Languages::getDisplayText($page->getId()).'</a><a class="ut-nav__toggle-link"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-3">';
                } else {
                    return '<li class="ut-nav__item ut-nav__item--level-2" data-level-count="'.$page->getSiblingNumber().'"><div class="ut-nav__link-group "><a class="ut-link ut-nav__link ut-nav__link--level-2 ut-nav__link--is-disabled">'.Languages::getDisplayText($page->getId()).'</a><a class="ut-nav__toggle-link"><span class="ut-nav__toggle-line"></span><span class="ut-nav__toggle-icon"></span></a></div><ul class="ut-nav__list ut-nav__list--level-3">';
                }
            default:
                throw new \Exception('menu level ' . $page->getLevel() . ' cannot be rendered with children');
        }
    }

    /**
     * Build start block for a menu element with children (callback after children)
     *
     * @param Page $page    page object
     *
     * @return string
     * @throws Exception
     */
    static private function _buildMenuChildrenEnd(Page $page) {
        switch ($page->getLevel()) {
            case 1:
                return '</ul></li>';
            case 2:
                return '</ul></li>';
            default:
                throw new \Exception('menu level ' . $page->getLevel() . ' cannot be rendered with children');
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
     * @param Page $page    page object
     *
     * @return string       HTML code for the menu entry
     */
    static private function _buildSitemapNoChildren(Page $page) {
        return '<li class="ut-nav__item" data-level-count="'.$page->getSiblingNumber().'"><a class="ut-link ut-nav__link" href="?page='.$page->getId().'">' . Languages::getDisplayText($page->getId()) . '</a></li>';
    }

    /**
     * Build start block for a sitemap element with children (callback before children)
     *
     * @param Page $page    page object
     *
     * @return string
     */
    static private function _buildSitemapChildrenStart(Page $page) {
        return '<li class="ut-nav__item" data-level-count="'.$page->getSiblingNumber().'"><a class="ut-link ut-nav__link" href="?page='.$page->getId().'">' . Languages::getDisplayText($page->getId()) . '</a></li><ul>';
    }

    /**
     * Build start block for a sitemap element with children (callback after children)
     *
     * @param Page $page    page object
     * @param int $level    level of the page
     *
     * @return string
     */
    static private function _buildSitemapChildrenEnd(Page $page) {
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
     * @param Page $page
     */
    static private function _createTemplate(Page $page) {
        Template::create($page->getId());
    }

    /**
     * Get page path (e.g. for breadcrumb)
     *
     * @param Page $page        page
     * @param bool $localized   translated page names?
     *
     * @return array
     */
    static public function getBreadcrumbPath(Page $page, $localized=false) {
        $return = [];
        self::_getBreadcrumbPath($page, self::getPages(), $return);
        $return = array_reverse($return);

        if ($localized) {
            $return2 = [];
            foreach ($return as $page) {
                $return2[] = Languages::getDisplayText($page->getId());
            }
            $return = $return2;
        }

        return $return;
    }

    /**
     * Helper function for recursion
     *
     * @param Page $page
     * @param array $subtree
     * @param array &$return
     * @return boolean
     */
    static private function _getBreadcrumbPath(Page $page, $subtree, &$return) {
        foreach ($subtree as $pageFromTree) {
            if ($pageFromTree->getId() == $page->getId()) {
                $return[] = $pageFromTree;
                return true;
            } elseif ($pageFromTree->hasChildren() && self::_getBreadcrumbPath($page, $pageFromTree->getChildren(), $return)) {
                $return[] = $pageFromTree;
                return true;
            }
        }
        return false;
    }

    /**
     * Get pagetree
     *
     * @return array
     */
    static public function getPages() {
        if (!isset(self::$_pages)) {
            throw new \Exception('Pagetree not available!');
        }
        return self::$_pages;
    }

    /**
     * Get page with a special id
     *
     * @param id $id
     *
     * @return array
     */
    static public function getPage($id) {
        self::$_callbackPageId = $id;
        self::$_callbackResult = null;
        self::iterate('self::_getPageCallback');
        return self::$_callbackResult;
    }

    /**
     * Get page with a special id (callback function)
     *
     * @param Page $page
     */
    static private function _getPageCallback(Page $page) {
        if ($page->getId() == self::$_callbackPageId) {
            self::$_callbackResult = $page;
        }
    }

    /**
     * Get list of page and all siblings
     *
     * @param Page $page
     *
     * @return array
     */
    static public function getPageSiblings(Page $page) {
        $pagePath = array_reverse(self::getBreadCrumbPath($page));
        $siblings = self::getPages();
        do {
            $parentPage = array_pop($pagePath);
            print "parent: " . $parentPage->getId() . "<br/>\n";
            if ($page->getId() != $parentPage->getId() && $parentPage->hasChildren()) {
                $siblings = $parentPage->getChildren();
            }
        } while (count($pagePath) > 0);
        return $siblings;
    }

    /**
     * Init pagetree from Xml file
     * using cache file if exists, else it will be generated
     *
     * @param string $xmlPath
     */
    static public function initPages($xmlPath) {
        $cachePath = DIR_PUBLIC_CACHE . 'pages.cache';

        if (!is_file($cachePath)) {
            $pages = [];
            $level = 1;
            $siblingNumber = 1;

            $dom = new \DOMDocument();
            $dom->load($xmlPath);

            $node = $dom->documentElement->firstChild;
            while ($node != null) {
                if ($node instanceof \DOMElement) {
                    list($id, $callable, $subpages) = self::_initPagesRecursive($node, $level+1);
                    $page = new Page($id, $level, $siblingNumber, $callable, $subpages);
                    ++$siblingNumber;
                    $pages[$id] = $page;
                }
                $node = $node->nextSibling;
            }

            file_put_contents($cachePath, serialize($pages));
        }

        self::$_pages = unserialize(file_get_contents($cachePath));
    }

    /**
     * Get all subpages (recursive) for a page
     *
     * @param \DOMElement $page
     * @param int $level
     *
     * @return [id, callable, subpages]
     */
    static protected function _initPagesRecursive(\DOMElement $page, $level) {
        $id = $page->getAttribute('id');
        $callable = ($page->getAttribute('callable') != 'false');
        $siblingNumber = 1;
        $subpages = [];

        $node = $page->firstChild;
        while ($node != null) {
            if ($node instanceof \DOMElement) {
                list($subpageId, $subpageCallable, $subpageChildren) = self::_initPagesRecursive($node, $level+1);
                $subpage = new Page($subpageId, $level, $siblingNumber, $subpageCallable, $subpageChildren);
                ++$siblingNumber;
                $subpages[$subpage->getId()] = $subpage;
            }
            $node = $node->nextSibling;
        }

        return [$id, $callable, $subpages];
    }

    /**
     * Iteration over pagetree with single callback for each page
     * @param string $callback
     */
    static public function iterate($callback) {
        return self::_iterate(self::getPages(), $callback);
    }

    /**
     * Recursive helper function for iterations (single callback)
     *
     * @param array $subtree
     * @param function $callback
     *
     * @return string
     */
    static private function _iterate($subtree, $callback) {
        $return = '';
        foreach ($subtree as $pageId => $page) {
            $return .= call_user_func($callback, $page);
            $return .= self::_iterate($page->getChildren(), $callback);
        }
        return $return;
    }

    /**
     * Iteration over pagetree with several callbacks for each element,
     * dependant on whether an element has children or not
     *
     * @param function $callbackNoChildren
     * @param function $callbackChildrenStart
     * @param function $callbackChildrenEnd
     *
     * @return string
     */
    static public function iterate2($callbackNoChildren, $callbackChildrenStart, $callbackChildrenEnd) {
        return self::_iterate2(self::getPages(), $callbackNoChildren, $callbackChildrenStart, $callbackChildrenEnd);
    }

    /**
     * Recursive helper function for iterations (multiple callbacks)
     *
     * @param array $subtree
     * @param function $callbackNoChildren
     * @param function $callbackChildrenStart
     * @param function $callbackChildrenEnd
     *
     * @return string
     */
    static private function _iterate2($subtree, $callbackNoChildren, $callbackChildrenStart, $callbackChildrenEnd) {
        $return = '';
        foreach ($subtree as $pageId => $page) {
            if ($page->hasChildren()) {
                $return .= call_user_func($callbackChildrenStart, $page);
                $return .= self::_iterate2($page->getChildren(), $callbackNoChildren, $callbackChildrenStart, $callbackChildrenEnd);
                $return .= call_user_func($callbackChildrenEnd, $page);
            } else {
                $return .= call_user_func($callbackNoChildren, $page);
            }
        }
        return $return;
    }
}
