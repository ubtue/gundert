<?php

namespace Gundert;

class Helper {
    /**
     * Get full paths of all files in the given directory, filtered by PCRE pattern if needed.
     *
     * @param string $dir
     * @param string $pattern
     * 
     * @return array
     */
    static public function GetFilesRecursive($dir, $pattern='"."') {
        $directory = new \RecursiveDirectoryIterator($dir);
        $iterator = new \RecursiveIteratorIterator($directory);
        $files = [];
        foreach ($iterator as $info) {
            if (!$info->isDir() && preg_match($pattern, $info->getPathname())) {
                $files[] = $info->getPathname();
            }
        }
        return $files;
    }
}
