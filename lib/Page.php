<?php

namespace Gundert;
class Page {
    /**
     * Is the page currently active?
     * @var bool
     */
    private $_active = false;

    /**
     * Is the page callable?
     * This is useful for Menu entries that have children, but are not meant
     * to be called themselves.
     * @var bool
     */
    private $_callable = true;

    /**
     * Should a container be added to the page?
     * (disable e.g. if a carousel needs to be displayed, which would be limited by a container)
     * @var bool
     */
    private $_container = true;

    /**
     * Should a page be excluded from menu sorting, even if parent has child sorting enabled?
     * @var bool
     */
    private $_excludeFromSort = false;

    /**
     * Is the page hidden?
     * e.g. for pages that should only be reachable via footer link, like "sitemap"
     * @var bool
     */
    private $_hidden = false;

    /**
     * Page ID (for pagetree, template filename, menu display text, etc.)
     * @var string
     */
    private $_id;

    /**
     * Menu level of the page
     * @var int
     */
    private $_level;

    /**
     * Sibling number of the page
     * @var int
     */
    private $_siblingNumber;

    /**
     * Shall children be sorted?
     * @var bool
     */
    private $_sortChildren;

    /**
     * Child pages
     * @var array
     */
    private $_children = [];

    /**
     * Parent page
     * @var Page
     */
    private $_parent = null;

    /**
     * Constructor
     *
     * @param string $id            Page ID
     * @param int $level            Menu level of the Page
     * @param int $siblingNumber    Sibling number of the page inside its parent
     * @param bool $hidden          Is the page hidden in menu?
     * @param bool $callable        Is the page callable in menu?
     * @param bool $container       Should a container be auto-inserted into the page?
     * @param bool $sortChildren    Should children be sorted?
     * @param bool $excludeFromSort Shold page be excluded from child sorting?
     * @param mixed $children       Page or array of Page objects
     */
    function __construct($id, $level, $siblingNumber, $hidden=false, $callable=true, $container=true, $sortChildren=false, $excludeFromSort=true, $children=[]) {
        $this->_hidden = $hidden;
        $this->_callable = $callable;
        $this->_container = $container;
        $this->_id = $id;
        $this->_level = $level;
        $this->_siblingNumber = $siblingNumber;
        $this->_sortChildren = $sortChildren;
        $this->_excludeFromSort = $excludeFromSort;
        $this->_setChildren($children);
    }

    /**
     * Set children
     *
     * @param mixed $children   (Page or array of Page objects)
     */
    private function _setChildren($children) {
        if (!is_array($children)) {
            $children = [$children];
        }

        $this->_children = [];
        foreach ($children as $child) {
            $this->_children[$child->getId()] = $child;
        }
    }

    /**
     * Get Children (sort order depending on _sortChildren value)
     *
     * @return array
     */
    public function getChildren() {
        if ($this->isSortChildrenActive()) {
            $sortMap = [];
            $sortEndMap = [];
            foreach ($this->_children as $id => $child) {
                $name = Languages::getDisplayText($child->getId());
                if ($child->isExcludedFromSort())
                    $sortEndMap[$name] = $id;
                else
                    $sortMap[$name] = $id;
            }
            ksort($sortMap);
            ksort($sortEndMap);

            $children = [];
            foreach ($sortMap as $name => $id)
                $children[$id] = $this->_children[$id];

            foreach ($sortEndMap as $name => $id)
                $children[$id] = $this->_children[$id];

            return $children;
        } else
            return $this->_children;
    }

    /**
     * Get Id
     *
     * @return string
     */
    public function getId() {
        return $this->_id;
    }

    /**
     * Get level
     *
     * @return int
     */
    public function getLevel() {
        return $this->_level;
    }

    /**
     * Get parent (or null)
     * @return Page
     */
    public function getParent() {
        return $this->_parent;
    }

    /**
     * Get sibling number
     *
     * @return int
     */
    public function getSiblingNumber() {
        return $this->_siblingNumber;
    }

    /**
     * Has Children
     *
     * @return bool
     */
    public function hasChildren() {
        return count($this->_children) > 0;
    }

    /**
     * Is the page currently active?
     * @return bool
     */
    public function isActive() {
        return ($this->_active || $this->isChildActive());
    }

    /**
     * Is a child page active?
     */
    public function isChildActive() {
        foreach($this->_children as $child) {
            if ($child->isActive())
                return true;
        }
        return false;
    }

    /**
     * Is callable
     *
     * @return bool
     */
    public function isCallable() {
        return $this->_callable;
    }

    /**
     * Is container
     *
     * @return bool
     */
    public function isContainer() {
        return $this->_container;
    }

    /**
     * Is excluded from child sort?
     * @return bool
     */
    public function isExcludedFromSort() {
        return $this->_excludeFromSort;
    }

    /**
     * Is hidden
     *
     * @return bool
     */
    public function isHidden() {
        return $this->_hidden;
    }

    /**
     * Is child sort active?
     * @return bool
     */
    public function isSortChildrenActive() {
        return $this->_sortChildren;
    }

    /**
     * Mark this page as currently active
     */
    public function setActive() {
        $this->_active = true;
    }

    /**
     * Set parent reference
     * @param Page $parent
     */
    public function setParent(&$parent) {
        $this->_parent = $parent;
    }

    /**
     * Update parent references.
     * Needs to be called after pagetree is loaded from page cache.
     * (references cannot be serialized)
     */
    public function updateParentReferences() {
        foreach ($this->_children as &$child) {
            $child->setParent($this);
            $child->updateParentReferences();
        }
    }

    public function updateActive($activePageId) {
        if ($this->getId() == $activePageId)
            $this->setActive();
        else {
            foreach ($this->_children as &$child) {
                $child->updateActive($activePageId);
                if ($child->isActive())
                    $this->setActive();
            }
        }
    }
}
