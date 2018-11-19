<?php

namespace Gundert;

class Config {

    const MATOMO_ENABLED_SETTING = 'GUNDERT_SETTING_MATOMO_ENABLED';

    /**
     * Get search from JSON config
     *
     * @param string $search_name
     * @return array
     */
    static public function GetSearch($search_name) {
        $searches = self::GetSearches();
        return $searches[$search_name];
    }

    /**
     * Get all searches from JSON config
     * @return array
     */
    static public function GetSearches() {
        $jsonSearches = json_decode(file_get_contents(DIR_PUBLIC . 'searches.json'));
        $searches = [];
        foreach ($jsonSearches as $id => $jsonSearch) {
            $searches[$id] = new Search($id, $jsonSearch);
        }
        return $searches;
    }

    /**
     * Is Matomo enabled? (default false)
     *
     * @return bool
     */
    static public function IsMatomoEnabled() {
        return defined(self::MATOMO_ENABLED_SETTING) && constant(self::MATOMO_ENABLED_SETTING) === true;
    }

    /**
     * Set Matomo enabled (include JS snippet)
     *
     * @param bool
     */
    static public function SetMatomoEnabled($bool) {
        define(self::MATOMO_ENABLED_SETTING, $bool);
    }
}
