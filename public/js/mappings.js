/**
 * map page id to query params + result columns
 *
 * collections:
 *  - 52: Gundert Prints (Drucke)
 *  - 53: Gundert Manuscripts (Handschriften)
 *
 *  languages: (ISO-639-2)
 *  - deu (german)
 *  - eng (english)
 *  - mal (malayalam)
 *  - kan (kannada)
 *  - tam (tamil)
 *  - tel (telugu)
 *
 *  subject_ids:
 * (- short     | long                  | GND-Number)
 *  - lit       | Literatur             | 4035964-5
 *  - non-fic   | Fachliteratur         | 4153493-1 !!! nicht zugeordnet !!!
 *  - school    | Schulbuch             | 4053458-3
 *  - dic       | Wörterbuch            | 4066724-8
 *  - vya       | Grammar               | 4021806-5
 *  - records   | Archivalien           | 4142
 *  - letters   | Briefe                | 4008240-4 !!! nicht zugeordnet !!!
 *  - prov      | Sprichwörter          | 4056550-6
 *  - notes     | Notizbuch             | 4225695-1
 *  - rel       | Christliche Literatur | 4010110-1
 */
var GundertCategoryMappings = {

    DefaultMapping: {"query": {"collection": "52+53"}, "result": ["date", "title"]},
    Mappings: {
        // materials
        "printed_all": {"query": {"collection": "52"}, "result": ["date", "title", "subject_ids", "languages"]},
        "manuscripts_all": {"query": {"collection": "53"}, "result": ["date", "title", "subject_ids", "languages"]},
        "publications": {"query": {"collection": "52+53"}, "result": ["date", "title", "subject_ids", "languages"]},

        // material by language
        "malayalam_print": {"query": {"collection": "52", "languages": "mal"}, "result": ["date", "title", "subject_ids"]},
        "malayalam_manuscript": {"query": {"collection": "53", "languages": "mal"}, "result": ["date", "title", "subject_ids"]},
        "kannada_print": {"query": {"collection": "52", "languages": "kan"}, "result": ["date", "title", "subject_ids"]},
        "kannada_manuscript": {"query": {"collection": "53", "languages": "kan"}, "result": ["date", "title", "subject_ids"]},
        "tamil_print": {"query": {"collection": "52", "languages": "tam"}, "result": ["date", "title", "subject_ids"]},
        "tamil_manuscript": {"query": {"collection": "53", "languages": "tam"}, "result": ["date", "title", "subject_ids"]},
        "telugu_print": {"query": {"collection": "52", "languages": "tel"}, "result": ["date", "title", "subject_ids"]},
        "telugu_manuscript": {"query": {"collection": "53", "languages": "tel"}, "result": ["date", "title", "subject_ids"]},
        "german_print": {"query": {"collection": "52", "languages": "ger"}, "result": ["date", "title", "subject_ids"]},
        "german_manuscript": {"query": {"collection": "53", "languages": "ger"}, "result": ["date", "title", "subject_ids"]},
        "english_print": {"query": {"collection": "52", "languages": "eng"}, "result": ["date", "title", "subject_ids"]},
        "english_manuscript": {"query": {"collection": "53", "languages": "eng"}, "result": ["date", "title", "subject_ids"]},

        // material by genre
        "prose": {"query": {"collection": "52+53", "subject_ids": "4035964-5"}, "result": ["date", "title", "subject_ids", "languages"]},
        "proverbs": {"query": {"collection": "52+53", "subject_ids": "4056550-6"}, "result": ["date", "title", "subject_ids", "languages"]},
        "grammars_and_dictionaries": {"query": {"collection": "52+53", "subject_ids": "4053458-3+4066724-8+4021806-5"}, "result": ["date", "title", "subject_ids", "languages"]},
        "religious_works": {"query": {"collection": "52+53", "subject_ids": "4010110-1"}, "result": ["date", "title", "subject_ids", "languages"]},
        "notebooks_and_drafts": {"query": {"collection": "52+53", "subject_ids": "4225695-1"}, "result": ["date", "title", "subject_ids", "languages"]},
        "records_archive": {"query": {"collection": "52+53", "subject_ids": "4142"}, "result": ["date", "title", "subject_ids", "languages"]},
    },

    /**
     * Get mapping for the given category. Return default mapping if no mapping found
     *
     * @param string category
     *
     * @return object
     */
    GetMapping: function(category) {
        if (GundertCategoryMappings.Mappings[category] === undefined) {
            return GundertCategoryMappings.DefaultMapping;
        } else {
            return GundertCategoryMappings.Mappings[category];
        }
    },
};
