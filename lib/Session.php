<?php

namespace Gundert;

class Session {

    const KEY_LANGUAGE      = 'language';
    const KEY_DISPLAY_TEXTS = 'display_texts';

    /**
     * Get display text for this id. Tries to find it for the user's language.
     * If not available, it will try the default language.
     *
     * @param string $id
     */
    static public function getDisplayText($id) {
        $language = self::getLanguage();

        // for performance reasons, we directly access Session Variable
        // instead of copying the big array through multiple function results
        $displayTexts =& $_SESSION[self::KEY_DISPLAY_TEXTS];
        if (isset($displayTexts[$language][$id])) {
            return $displayTexts[$language][$id];
        } elseif (isset($displayTexts[Languages::CODE_DEFAULT][$id])) {
            return $displayTexts[Languages::CODE_DEFAULT][$id];
        } else {
            return '#' . $id . '#';
        }
    }

    /**
     * return cached display texts for all languages
     *
     * @return array
     */
    static public function getDisplayTexts() {
        return self::_getValue(self::KEY_DISPLAY_TEXTS);
    }

    /**
     * Get current language from session
     * @return string
     */
    static public function getLanguage() {
        return self::_getValue(self::KEY_LANGUAGE);
    }

    /**
     * Get a value from session
     *
     * @param string $key
     *
     * @return mixed
     */
    static private function _getValue($key) {
        if (isset($_SESSION[$key])) {
            return $_SESSION[$key];
        } else {
            return false;
        }
    }

    /**
     * Initialize session (+store default values)
     */
    static public function initialize() {
        session_start();
        if (!self::getLanguage()) {
            self::setLanguage(Languages::CODE_DEFAULT);
        }
        self::setDisplayTexts(Languages::getDisplayTexts());
    }

    /**
     * Save display texts (for all languages) to session
     * @param array $displayTexts   array(languageCode => array(displayTextId => displayTextValue))
     */
    static public function setDisplayTexts($displayTexts) {
        self::_setValue(self::KEY_DISPLAY_TEXTS, $displayTexts);
    }

    /**
     * Set user's language. Also cache display texts for this language.
     *
     * @param string $language
     */
    static public function setLanguage($language) {
        self::_setValue(self::KEY_LANGUAGE, $language);
    }

    /**
     * Store a value in session
     *
     * @param string $key
     * @param mixed $value
     */
    static private function _setValue($key, $value) {
        $_SESSION[$key] = $value;
    }
}