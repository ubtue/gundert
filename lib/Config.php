<?php

namespace Gundert;

class Config {

    const MATOMO_ENABLED_SETTING = 'GUNDERT_SETTING_MATOMO_ENABLED';

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
