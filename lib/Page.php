<?php

namespace Gundert;
class Page {
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
     * @param mixed $children       Page or array of Page objects
     */
    function __construct($id, $level, $siblingNumber, $children=[]) {
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
}
