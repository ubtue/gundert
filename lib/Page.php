<?php

namespace Gundert;
class Page {
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
     * Child pages
     * @var array
     */
    private $_children = [];

    /**
     * Constructor
     *
     * @param string $id            Page ID
     * @param int $level            Menu level of the Page
     * @param int $siblingNumber    Sibling number of the page inside its parent
     * @param bool $hidden          Is the page hidden in menu?
     * @param bool $callable        Is the page callable in menu?
     * @param bool $container       Should a container be auto-inserted into the page?
     * @param mixed $children       Page or array of Page objects
     */
    function __construct($id, $level, $siblingNumber, $hidden=false, $callable=true, $container=true, $children=[]) {
        $this->_hidden = $hidden;
        $this->_callable = $callable;
        $this->_container = $container;
        $this->_id = $id;
        $this->_level = $level;
        $this->_siblingNumber = $siblingNumber;
        $this->addChildren($children);
    }

    /**
     * Get all subpages (recursive) for a page
     *
     * @param mixed $children   (Page or array of Page objects)
     */
    public function addChildren($children) {
        if (!is_array($children)) {
            $children = [$children];
        }

        foreach ($children as $child) {
            $this->_children[$child->getId()] = $child;
        }
    }

    /**
     * Get Children
     *
     * @return array
     */
    public function getChildren() {
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
     * Is hidden
     *
     * @return bool
     */
    public function isHidden() {
        return $this->_hidden;
    }
}
