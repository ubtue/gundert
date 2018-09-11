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
 * - 4035964-5
 * - 4153493-1
 * - 4053458-3
 * - 4066724-8
 * - 4021806-5
 * - 4142968-0
 * - 4008240-4
 * - 4056550-6
 * - 4225695-1
 * - 4010110-1
 */
var GundertCategoryMappings = {

    TranslatableFields: ["languages", "subject_ids"],
    DefaultMapping: {"query": {"collection": "52+53"}, "result": ["date", "title"]},
    Mappings: {
        // materials
        "printed_all": {"query": {"collection": "52"}, "result": ["date", "title", "subject_ids", "languages"]},
        "manuscripts_all": {"query": {"collection": "53"}, "result": ["date", "title", "subject_ids", "languages"]},
        "overall_portfolio": {"query": {"collection": "52+53"}, "result": ["projectname", "date", "title", "subject_ids", "languages", "collection"]},

        // material by language
        "malayalam": {"query": {"collection": "52+53", "languages": "mal"}, "result": ["date", "title", "subject_ids", "collection"]},
        "kannada": {"query": {"collection": "52+53", "languages": "kan"}, "result": ["date", "title", "subject_ids", "collection"]},
        "tamil": {"query": {"collection": "52+53", "languages": "tam"}, "result": ["date", "title", "subject_ids", "collection"]},
        "telugu": {"query": {"collection": "52+53", "languages": "tel"}, "result": ["date", "title", "subject_ids", "collection"]},
        "sanskrit": {"query": {"collection": "52+53", "languages": "san"}, "result": ["date", "title", "subject_ids", "collection"]},
        "german": {"query": {"collection": "52+53", "languages": "ger"}, "result": ["date", "title", "subject_ids", "collection"]},
        "english": {"query": {"collection": "52+53", "languages": "eng"}, "result": ["date", "title", "subject_ids", "collection"]},
        "other_languages": {"query": {"collection": "52+53", "!languages": "mal+kan+tam+tel+san+ger+eng"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},

        // material by genre
        "fiction": {"query": {"collection": "52+53", "subject_ids": "4035964-5"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "non-fiction": {"query": {"collection": "52+53", "subject_ids": "4153493-1"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "proverbs": {"query": {"collection": "52+53", "subject_ids": "4056550-6"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "grammars_and_dictionaries": {"query": {"collection": "52+53", "subject_ids": "4053458-3+4066724-8+4021806-5"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "religious_works": {"query": {"collection": "52+53", "subject_ids": "4010110-1"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "notebooks_and_drafts": {"query": {"collection": "52+53", "subject_ids": "4225695-1"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},
        "records_archive": {"query": {"collection": "52+53", "subject_ids": "4142968-0"}, "result": ["date", "title", "subject_ids", "languages", "collection"]},

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
        if (GundertCategoryMappings.Mappings[category] === undefined)
            return GundertCategoryMappings.DefaultMapping;
        else
            return GundertCategoryMappings.Mappings[category];
    },
};
