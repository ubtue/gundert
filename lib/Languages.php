<?php

namespace Gundert;

class Languages {
    const CODE_DE = 'de';
    const CODE_EN = 'en';
    const CODE_DEFAULT = self::CODE_DE;

    /**
     * Get display text for the selected id
     *
     * @param string $id
     */
    static public function getDisplayText($id) {
        return Session::getDisplayText($id);
    }

    /**
     * Get array with display texts for the chosen language, if given. Else for all languages.
     *
     * @param string $language
     *
     * @return array
     */
    static public function getDisplayTexts($language=null) {
        if ($language != null) {
            return self::_parseLanguageFile($language);
        } else {
            $displayTexts = array();
            $languages = self::getLanguages();
            foreach ($languages as $language) {
                $displayTexts[$language] = self::_parseLanguageFile($language);
            }
            return $displayTexts;
        }
    }

    /**
     * Get list of all defined languages
     *
     * @return array
     */
    static public function getLanguages() {
        $languages = array();

        $reflection = new \ReflectionClass(__CLASS__);
        $constants = $reflection->getConstants();
        foreach ($constants as $key => $value) {
            if (preg_match('"^CODE_"', $key)) {
                $languages[] = $value;
            }
        }

        return array_unique($languages);
    }

    /**
     * Get path of language file. If file doesnt exist,
     * returns path of default language file.
     *
     * @param string $language
     *
     * @return string
     */
    static private function _getPath($language) {
        $path = DIR_LANG . $language . '.ini';
        if ($language != self::CODE_DEFAULT && !is_file($path)) {
            return self::_getPath($self::CODE_DEFAULT);
        }
        return $path;
    }

    /**
     * Parse language file into array
     *
     * @param string $language
     *
     * @return array
     */
    static private function _parseLanguageFile($language) {
        return parse_ini_file(self::_getPath($language));
    }
}
