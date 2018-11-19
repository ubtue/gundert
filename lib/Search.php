<?php

namespace Gundert;
class Search {

    /**
     * unique ID of the search
     * @var string
     */
    private $_id;

    /**
     * collections of the search
     * @var array
     */
    private $_collections;

    /**
     * languages of the search
     * @var array
     */
    private $_languages;

    /**
     * excluded languages of the search
     * @var array
     */
    private $_notLanguages;

    /**
     * subject ids of the search, delimited by '+'
     * @var array
     */
    private $_subjectIds;

    /**
     * array of result columns
     * @var array
     */
    private $_columns;

    function __construct($id, $jsonInput) {
        $this->_id = $id;

        if (isset($jsonInput->collection))
            $this->_collections = explode('+', $jsonInput->collection);
        if (isset($jsonInput->languages))
            $this->_languages = explode('+', $jsonInput->languages);
        if (isset($jsonInput->notLanguages))
            $this->_notLanguages = explode('+', $jsonInput->notLanguages);
        if (isset($jsonInput->subject_ids))
            $this->_subjectIds = explode('+', $jsonInput->subject_ids);
    }

    /**
     * build URL based on class variables
     * @return string
     */
    private function _buildUrl() {
        $url = OPENDIGI_API_ENDPOINT;
        $url .= '?collection=' . implode('+', $this->_collections);
        if ($this->_languages)
            $url .= '&languages=' . implode('+', $this->_languages);
        if ($this->_notLanguages)
            $url .= '&!languages' . implode('+', $this->_notLanguages);
        if ($this->_subjectIds)
            $url .= '&subject_ids=' . implode('+', $this->_subjectIds);

        return $url;
    }

    /**
     * get path of cache file for this search
     * @return type
     */
    private function _getCachePath() {
        return DIR_PUBLIC_CACHE_SEARCHES . $this->_id . '.json';
    }

    /**
     * try to get cached result for this search.
     * if not exists or too old, try to get live result.
     * @return string
     */
    public function getCachedResult() {
        $cachePath = $this->_getCachePath();
        if (is_file($cachePath)) {
            $cacheModifiedTime = filemtime($cachePath);
            if ($cacheModifiedTime < time() - CACHE_EXPIRED_DELAY) {
                $result = $this->getLiveResult();
                if ($result)
                    return $result;
                else
                    touch($cachePath);
            }

            return file_get_contents($cachePath);
        }

        return $this->getLiveResult();
    }

    /**
     * get result from live server, and store in cache if successful.
     * @return string
     */
    public function getLiveResult() {
        $url = $this->_buildUrl();
        $result = file_get_contents($url);
        if ($result && $result != '[]' && @json_decode($result) != false) {
            if (!is_dir(DIR_PUBLIC_CACHE_SEARCHES))
                mkdir(DIR_PUBLIC_CACHE_SEARCHES, 0777, true);
            file_put_contents($this->_getCachePath(), $result);
            return $result;
        }
    }

}
?>
