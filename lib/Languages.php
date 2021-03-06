<?php

namespace Gundert;

class Languages {
    const CODE_DE = 'de';
    const CODE_EN = 'en';
    const CODE_PREFERRED = self::CODE_DE;
    const CODE_FALLBACK = self::CODE_EN;
    const CODES = [self::CODE_DE, self::CODE_EN];
    const UIDS = [self::CODE_DE => 0, self::CODE_EN => 1];

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
     * Try to autodetect language from HTTP request.
     *
     * Tries to find CODE_PREFERRED, if not found, returns CODE_FALLBACK.
     *
     * @return string
     */
    static public function getRequestedLanguage() {
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) && preg_match_all('"(([A-Z-]+)(;q=(\d\.\d))?)"i', $_SERVER['HTTP_ACCEPT_LANGUAGE'], $matches)) {
            $languageCandidates = $matches[2];
            foreach($languageCandidates as $languageCandidate) {
                if (preg_match('"^' . self::CODE_PREFERRED . '"i', $languageCandidate)) {
                    return self::CODE_PREFERRED;
                }
            }
        }
        return self::CODE_FALLBACK;
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
        if ($language != self::CODE_FALLBACK && !is_file($path)) {
            return self::_getPath(self::CODE_FALLBACK);
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
