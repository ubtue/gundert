<?php

namespace Gundert;

class Letters {
    /**
     * Extract Letters ZIP to cache dir
     */
    static private function ExtractLetters() {
        $zipPath = DIR_PUBLIC_LETTERS . 'Briefe Hermann Gunderts von 1823-1893.zip';
        $zipArchive = new \ZipArchive();
        $zipArchive->open($zipPath);
        $zipArchive->extractTo(DIR_PUBLIC_CACHE_LETTERS);
        $zipArchive->close();
    }

    /**
     * Get letters as array
     * Returned value is meant to be used as input for json_encode.
     *
     * @param string $dir
     * @param string $pattern
     *
     * @return array
     */
    static public function GetLetters() {
        if (!is_dir(DIR_PUBLIC_CACHE_LETTERS_P5))
            self::ExtractLetters();

        $paths = Helper::GetFilesRecursive(DIR_PUBLIC_CACHE_LETTERS_P5);
        $letters = [];
        foreach ($paths as $path) {
            $letterId = basename($path);
            $letterSubdir = basename(dirname($path));
            $letter = [];
            $letter['id'] = $letterId;
            $urlBase = '/cache/letters/';
            $letter['urlP5'] = $urlBase . 'P5/' . $letterSubdir . '/' . $letterId;
            $letterIdTxt = preg_replace('"^HG"', 'H', $letterId);
            $letterIdTxt = preg_replace('"\.(\d)$"', '\\1', $letterIdTxt);
            $letter['urlTXT'] = $urlBase . 'TXT/' . $letterSubdir . '/' . $letterIdTxt . '.TXT';

            if (preg_match('"^HG(\d{2})(\d{2})(\d{2})(\.(\d))?$"', $letterId, $hits)) {
                $letter['year'] = 18 . $hits[3];
                if ($hits[2] != '00')
                    $letter['month'] = $hits[2];
                if ($hits[1] != '00')
                $letter['day'] = $hits[1];
                if (isset($hits[5]))
                    $letter['exemplar'] = $hits[5];
            } else if (preg_match('"^HG(BI|LI)(\d{4})(\.(\d))?$"', $letterId, $hits)) {
                if ($hits[2] > "1900") {
                    $letter['year'] = '18' . substr(strval($hits[2]), 0, 2) . '/18' . substr(strval($hits[2]), 2, 2);
                } else
                    $letter['year'] = $hits[2];
                if (isset($hits[4]))
                    $letter['exemplar'] = $hits[4];
            }

            $letter['date'] = $letter['year'];
            if (isset($letter['month'])) {
                $letter['date'] .= '-' . $letter['month'];
                if (isset($letter['day']))
                    $letter['date'] .= '-' . $letter['day'];
            }

            $letters[] = $letter;
        }
        return $letters;
    }

}
