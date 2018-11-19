/**
 * map page id to query params + result columns
 *
 * collections:
 *  - 52: Gundert Prints (Drucke)
 *  - 53: Gundert Manuscripts (Handschriften)
 *
 * languages: (ISO-639-2)
 *  - deu (german)
 *  - eng (english)
 *  - mal (malayalam)
 *  - kan (kannada)
 *  - tam (tamil)
 *  - tel (telugu)
 *
 * subject_ids (GND-Number, translations see ini files):
 * - 4008240-4
 * - 4010110-1
 * - 4021806-5
 * - 4035964-5
 * - 4053458-3
 * - 4056550-6
 * - 4066724-8
 * - 4123412-1
 * - 4128022-2
 * - 4142968-0
 * - 4153493-1
 * - 4225695-1

 */
var GundertCategoryMappings = {

    TranslatableFields: ["languages", "subject_ids"],

    /**
     * If you add new searches here, please also add searches in "searches.json" for PHP backend.
     * (while testing, performance on opendigi server was very bad, so we decided to introduce PHP side caching as well).
     */
    Mappings: {
        // materials
        "printed_all": {"url": "/search.php?id=printed_all", "result": ["shelfmark", "date", "title", "authors", "subject_ids", "languages"]},
        "manuscripts_all": {"url": "/search.php?id=manuscripts_all", "result": ["shelfmark", "date", "title", "authors", "subject_ids", "languages"]},
        "overall_portfolio": {"url": "/search.php?id=overall_portfolio", "result": ["shelfmark", "date", "title", "authors", "subject_ids", "languages", "collection"]},

        // material by language
        "malayalam": {"url": "/search.php?id=malayalam", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "kannada": {"url": "/search.php?id=kannada", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "tamil": {"url": "/search.php?id=tamil", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "telugu": {"url": "/search.php?id=telugu", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "sanskrit": {"url": "/search.php?id=sanskrit", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "german": {"url": "/search.php?id=german", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "english": {"url": "/search.php?id=english", "result": ["date", "title", "authors", "subject_ids", "collection"]},
        "other_languages": {"url": "/search.php?id=other_languages", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},

        // material by genre
        "fiction": {"url": "/search.php?id=fiction", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "non-fiction": {"url": "/search.php?id=non-fiction", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "proverbs": {"url": "/search.php?id=proverbs", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "grammars_and_dictionaries": {"url": "/search.php?id=grammars_and_dictionaries", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "religious_works": {"url": "/search.php?id=religious_works", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "notebooks_and_drafts": {"url": "/search.php?id=notebooks_and_drafts", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},
        "records_archive": {"url": "/search.php?id=records_archive", "result": ["date", "title", "authors", "subject_ids", "languages", "collection"]},

        // material by genre (custom page):
        "letters": {"url": "/cache/letters.json", "result": ["date", "id", "urlTXT", "urlP5"]},
    },

    /**
     * Get mapping for the given category. Return default mapping if no mapping found
     *
     * @param string category
     *
     * @return object
     */
    GetMapping: function(category) {
        return GundertCategoryMappings.Mappings[category];
    },
};
