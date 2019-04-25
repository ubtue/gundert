/**
 * map page id to query params + result columns
 */
var GundertCategoryMappings = {

    TranslatableFields: ["languages", "subjects"],

    /**
     * If you add new searches here, please also add searches in "searches.json" for PHP backend.
     * (while testing, performance on opendigi server was very bad, so we decided to introduce PHP side caching as well).
     */
    Mappings: {
        // materials
        "printed_all": {"url": "/search.php?id=printed_all", "result": ["shelfmark", "date", "title", "names", "subjects", "languages"]},
        "manuscripts_all": {"url": "/search.php?id=manuscripts_all", "result": ["shelfmark", "date", "title", "names", "subjects", "languages"]},
        "overall_portfolio": {"url": "/search.php?id=overall_portfolio", "result": ["shelfmark", "date", "title", "names", "subjects", "languages", "collection"]},

        // material by language
        "malayalam": {"url": "/search.php?id=malayalam", "result": ["date", "title", "names", "subjects", "collection"]},
        "kannada": {"url": "/search.php?id=kannada", "result": ["date", "title", "names", "subjects", "collection"]},
        "tamil": {"url": "/search.php?id=tamil", "result": ["date", "title", "names", "subjects", "collection"]},
        "telugu": {"url": "/search.php?id=telugu", "result": ["date", "title", "names", "subjects", "collection"]},
        "sanskrit": {"url": "/search.php?id=sanskrit", "result": ["date", "title", "names", "subjects", "collection"]},
        "german": {"url": "/search.php?id=german", "result": ["date", "title", "names", "subjects", "collection"]},
        "english": {"url": "/search.php?id=english", "result": ["date", "title", "names", "subjects", "collection"]},
        "other_languages": {"url": "/search.php?id=other_languages", "result": ["date", "title", "names", "subjects", "languages", "collection"]},

        // material by genre
        "fiction": {"url": "/search.php?id=fiction", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "non-fiction": {"url": "/search.php?id=non-fiction", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "proverbs": {"url": "/search.php?id=proverbs", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "grammars_and_dictionaries": {"url": "/search.php?id=grammars_and_dictionaries", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "religious_works": {"url": "/search.php?id=religious_works", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "notebooks_and_drafts": {"url": "/search.php?id=notebooks_and_drafts", "result": ["date", "title", "names", "subjects", "languages", "collection"]},
        "records_archive": {"url": "/search.php?id=records_archive", "result": ["date", "title", "names", "subjects", "languages", "collection"]},

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
