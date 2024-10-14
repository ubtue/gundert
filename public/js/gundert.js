var Gundert = {
    // Map field name to schema.org itemprop id
    SchemaOrgItemProps: {
        'title': 'name'
    },

    // Fields for which filter <select> will be generated
    FilterFields: [ 'collection', 'languages', 'subjects' ],

    // Fields for which normalization will be performed (all non valid characters will not be considered for sorting)
    NormalizeSortFields: { 'date': /[^0-9]+/g, 'title': /[„“\[\]]+/g },

    // Fields for which special characters will be normalized (e.g. Ā => A)
    NormalizeCharactersFields: ['title', 'names'],
    NormalizeCharacters: {
        'Ā': 'A',
        'ā': 'a',
        'Ḍ': 'D',
        'ḍ': 'd',
        'Ē': 'E',
        'ē': 'e',
        'ḥ': 'h',
        'Ī': 'I',
        'ī': 'i',
        'ı̄': 'i', // this line is viewed strange in some editors but is correct (ending apostroph behind special i character might not be viewed correctly)
        'ḻ': 'l',
        'ḷ': 'l',
        'ṃ': 'm',
        'ñ': 'n',
        'ṅ': 'n',
        'ṇ': 'n',
        'ō': 'o',
        'ṛ': 'r',
        'ṟ': 'r',
        'Ś': 'S',
        'ś': 's',
        'ṣ': 's',
        'ṭ': 't',
        'ū': 'u',
        '˘': ''
    },
    NormalizeString : function(value) {
        for (let [search, replace] of Object.entries(Gundert.NormalizeCharacters)) {
            value = value.replace(new RegExp(search, 'g'), replace);
        }
        return value;
    },

    // Register fields for responsive design to have a higher priority than others (default: 10000, highest: 1)
    // see https://datatables.net/extensions/responsive/priority
    ResponsiveFieldPriorities: { shelfmark: 1, 'title': 2 },

    // Separators for DataTables orthogonal data
    Separators: { Display: ',<br>', Filter: ',', Sort: ',' },
    SeparatorsAuthors: { Display: '<br>', Filter: ';', Sort: ';' },
    Cache: {

        // this is not only important for search results, but also for filter settings etc.!
        Enabled: true,

       /**
        * Get cache entry
        *
        * @param string key
        *
        * @return object
        */
        Get: function(key) {
            if (!Gundert.Cache.Enabled)
                return undefined;

            try {
                return JSON.parse(sessionStorage[key]);
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },

       /**
        * Store cache entry
        *
        * @param string key
        * @param object value
        */
        Set: function(key, value) {
            if (Gundert.Cache.Enabled)
                sessionStorage[key] = JSON.stringify(value);
        },

    },

    EscapeHtml: function(string) {
        return string
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    },

    // custom cache for column filters
    Filters: {

        /**
         * Get filter setting from cache
         * @param string key
         * @returns mixed
         */
        Get: function(key) {
            let filters = Gundert.Filters.GetAll();
            return filters[key];
        },

        /**
         * Get all filter settings from cache
         * @returns Object
         */
        GetAll() {
            let filters = Gundert.Cache.Get('filters');
            if (filters == undefined)
                return {};
            else
                return filters;
        },

        /**
         * Store single filter setting in cache
         * @param string key
         * @param mixed value
         */
        Set: function(key, value) {
            let filters = Gundert.Filters.GetAll();
            filters[key] = value;
            Gundert.Filters.SetAll(filters);
        },

        /**
         * Store filter settings in cache
         * @param object filters
         */
        SetAll: function(filters) {
            Gundert.Cache.Set('filters', filters);
        }
    },

    /**
     * Get a translated display text matching the user's selected language
     *
     * @param string id
     *
     * @return string
     */
    GetDisplayText: function(id) {
        const language = Gundert.GetLanguage();
        if (GundertDisplayTexts.hasOwnProperty(language) && GundertDisplayTexts[language].hasOwnProperty(id))
            return GundertDisplayTexts[language][id];
        else
            return '#' + id + '#';
    },

    /**
     * Get user's selected language (from HTML root element)
     *
     * @return string
     */
    GetLanguage: function() {
        return document.documentElement.lang;
    },

    /**
     * Get user language in a format usable for dataTables configuration
     * (default = English)
     *
     * @return string
     */
    GetLanguageForDatatables: function() {
        const language = Gundert.GetLanguage();
        switch (language) {
            case 'de':
                return 'German';
            case 'en':
            default:
                return 'English';
        }
    },

    /**
     * Helper function to get only the first element with a certain class
     *
     * @param string classname
     * @return DomElement
     */
    GetFirstElementByClassName: function(classname) {
        const elements = document.getElementsByClassName(classname);
        return elements[0];
    },

    /**
     * Get old language from cache
     * (needed to check if language has been changed)
     */
    GetOldLanguage: function() {
        return Gundert.Cache.Get('language_old');
    },

    /**
     * creates or reuses gundert-searchresult div element and fills with innerHTML
     *
     * @param string language
     * @return DomElement
     */
    GetOrCreateSearchResult: function(language, innerHTML) {
        let div_search_result = document.getElementById('gundert-searchresult');
        if (div_search_result == undefined) {
            let div_parent = document.getElementById('gundert-contentmiddle');
            let div_container = document.createElement('div');
            div_container.setAttribute('class', 'container');
            div_container.innerHTML = '<div id="gundert-searchresult" class="gundert-result-'+language+'"></div>';
            div_container = div_parent.insertBefore(div_container, div_parent.firstChild.nextSibling);
            div_search_result = div_container.firstChild;
        }

        // Setting the innerHTML needs to be done by jQuery,
        // else datatables might not see that the HTML has changed
        $('#gundert-searchresult').html(innerHTML);
    },

    HasLanguageChanged: function() {
        return (Gundert.GetLanguage() != Gundert.GetOldLanguage());
    },

    /**
     * Perform the search for a given category.
     * Sends query to remote server.
     *
     * @param string category
     * @param string language
     * @param bool add_headline
     */
    Query: function(category, language, add_headline) {
        Gundert.ShowLoader(language);
        let mapping = GundertCategoryMappings.GetMapping(category);
        const url = mapping['url'];
        let result = Gundert.Cache.Get(url);
        if (result != undefined) {
            Gundert.RenderResult(category, language, mapping, result, add_headline);
        } else {
            $.ajax({
                url: url,
                success: function(result) {
                    Gundert.Cache.Set(url, result);
                    Gundert.RenderResult(category, language, mapping, result, add_headline);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                    Gundert.RenderError();
                }
            });
        }
    },

    /**
     * Show errors
     */
    RenderError: function() {
        let innerHTML = '<font color="red">SORRY! The external information could not be received, please try again later.</font>';
        Gundert.GetOrCreateSearchResult('error', innerHTML);
    },

    /**
     * Converts the data from the JSON result
     * into a HTML table.
     *
     * @param string category
     * @param string language
     * @param object mapping
     * @param JsonObject data
     * @param bool add_headline
     */
    RenderResult: function(category, language, mapping, data, add_headline) {
        // Prepare result HTML
        let table = '';
        const fields = mapping['result'];
        let filter_column_numbers = [];
        let sort_column_no = 0;

        // headline
        if (add_headline)
            table += '<h1>'+Gundert.GetDisplayText(category)+'</h1>';

        // table header
        table += '<table id="gundert-searchresult-table" class="ut-table gundert-language-'+language+'">';
        table += '<thead class="ut-table__header">';
        table += '<tr class="ut-table__row">';
        let th_section = '';
        let column_no = 0;
        fields.forEach(function(field) {
            let priority = '';
            if (Gundert.ResponsiveFieldPriorities[field] != undefined)
                priority = ' data-priority="' + Gundert.ResponsiveFieldPriorities[field] + '"';
            th_section += '<th class="ut-table__item ut-table__header__item"' + priority + '>'+Gundert.GetDisplayText(field)+'</th>';
            if (Gundert.FilterFields.includes(field))
                filter_column_numbers.push(column_no);
            if (field == 'title')
                sort_column_no = column_no;
            ++column_no;
        });
        table += th_section;
        table += '</tr>';
        table += '</thead>';

        // table body
        table += '<tbody class="ut-table__body">';
        data.forEach(function(row) {
            table += '<tr class="ut-table__row" vocab="https://schema.org/" typeof="CreativeWork">';
            fields.forEach(function(field) {
                let column = row[field];
                if (field == "shelfmark")
                    column = row.identifiers.shelfmark;

                // normalize values to array
                let values = [];
                if (Array.isArray(column)) {
                    column.forEach(function(value) {
                        if (field == 'subjects')
                            values.push(value.gnd_id);
                        else if (field == 'names')
                            values.push(value.name);
                        else if (value != '')
                            values.push(value);
                    });
                } else if (field == 'title') {
                    if (column == null || column == '') {
                        if (row.longtitle != undefined && row.longtitle != null)
                            values.push(row.longtitle);
                    } else if (row.subtitle != undefined && row.subtitle != null)
                        values.push(column + ' - ' + row.subtitle);
                    else
                        values.push(column);
                } else if (column !== undefined && column != '' && column != null) {
                    values.push(column);
                }

                // translate values if necessary
                let translated_values = [];
                values.forEach(function(value) {
                    if (GundertCategoryMappings.TranslatableFields.includes(field)) {
                        let translated_value = Gundert.GetDisplayText(value);

                        // 2023-07-29: Hide Subject GND Numbers if translation is missing
                        if (!(field == 'subjects' && translated_value.includes('#')))
                            translated_values.push(translated_value);
                    } else if (field == 'collection')
                        translated_values.push(Gundert.GetDisplayText(field + '_' + value));
                    else
                        translated_values.push(value);
                });
                translated_values = translated_values.sort();

                // generate orthogonal data (display value + filter string)
                // see https://datatables.net/manual/data/orthogonal-data
                let cell_display = '';
                let cell_filter = '';
                let cell_sort = '';
                let value_nr = 0;
                translated_values.forEach(function(value) {
                    ++value_nr;
                    if (value_nr > 1) {
                        if (field == 'names') {
                            cell_display += Gundert.SeparatorsAuthors.Display;
                            cell_filter += Gundert.SeparatorsAuthors.Filter;
                            cell_sort += Gundert.SeparatorsAuthors.Sort;
                        } else {
                            cell_display += Gundert.Separators.Display;
                            cell_filter += Gundert.Separators.Filter;
                            cell_sort += Gundert.Separators.Sort;
                        }
                    }
                    if (field == 'title') {
                        // generate hyperlink if possible
                        if (row.projectname != undefined) {
                            url = 'https://opendigi.ub.uni-tuebingen.de/opendigi/'+ row.projectname;
                            if (language == 'en')
                                url += '?ui_lang=eng';
                            cell_display += '<a href="' + url + '" target="_blank">';
                            cell_display += value + '</a>';
                        } else if (row.identifiers.doi != undefined) {
                            url = 'https://doi.org/' + row.identifiers.doi;
                            cell_display += '<a href="' + url + '" target="_blank">' + value + '</a>';
                        } else
                            cell_display += value;
                    // urlP5 and urlTXT are for custom page "letters"
                    } else if (field == 'urlP5') {
                        cell_display += '<a class="ut-link ut-link--internal ut-link--block" href="' + value + '" target="_blank">P5</a>';
                    } else if (field == 'urlTXT') {
                        cell_display += '<a class="ut-link ut-link--internal ut-link--block" href="' + value + '" target="_blank">TXT</a>';
                    } else
                        cell_display += value;

                    cell_filter += value;

                    // also allow to search for projectname (should be similar to shelfmark)
                    if (field == 'shelfmark')
                        cell_filter += Gundert.Separators.Filter + row.identifiers.shelfmark;

                    if (Gundert.NormalizeSortFields[field] !== undefined && value != null)
                        cell_sort += value.replace(Gundert.NormalizeSortFields[field], '');
                    else
                        cell_sort += value;

                    if (Gundert.NormalizeCharactersFields.includes(field)) {
                        cell_filter = Gundert.NormalizeString(cell_filter);
                        cell_sort = Gundert.NormalizeString(cell_sort);
                    }

                    if (field == 'date') {
                        if (category == 'letters') {
                            // we can have only year (1828), or year-month (1828-08), or year-month-day (1828-03-08)
                            // so we set unspecific parts to end of period (month 12 day 31)
                            if (cell_sort.length == 4)
                                cell_sort += '12';
                            if (cell_sort.length == 6)
                                cell_sort += '31';
                        } else {
                            // date can contain either a normalized year (ca. 1964 => 1946) or a year range (1930-1970 => 19301970)
                            // sort is alphanumeric
                            // so we convert the year to a range by doubling it, so dataTables can compare 19641964 to 19301970 alphanumerically
                            if (cell_sort.length <= 4)
                                cell_sort = cell_sort + cell_sort;
                        }
                    }
                });

                table += '<td class="ut-table__item ut-table__body__item" data-filter="' + Gundert.EscapeHtml(cell_filter) + '" data-sort="' + Gundert.EscapeHtml(cell_sort) + '"';
                let itemprop = Gundert.SchemaOrgItemProps[field];
                if (itemprop !== undefined)
                    table += ' property="' + itemprop + '"';
                table += '>';
                table += cell_display;
                table += '</td>';
            });

            table += '</tr>';
        });
        table += '</tbody>';
        table += '<tfoot class="ut-table__footer">';
        table += th_section;
        table += '</tfoot>';
        table += '</table>';

        // Trigger DataTable plugin
        Gundert.GetOrCreateSearchResult(language, table);

        // set custom css classes
        //$.fn.dataTable.ext.classes.sFilterInput = 'ut-form__input';
        $.fn.dataTable.ext.classes.sLengthSelect = 'ut-form__select';
        $.fn.dataTable.ext.classes.sPageButton = 'ut-btn';
        $.fn.dataTable.ext.classes.sPageButtonActive = 'active';

        // clear old state if language has been changed
        // (else e.g. if an english subject filter was set, the german table will be empty and filter is not usable anymore)
        if (Gundert.HasLanguageChanged()) {
            console.log("language has changed, resetting filters...");
            let dataTable = $('#gundert-searchresult-table').DataTable();
            dataTable.state.clear();
            dataTable.destroy();
            Gundert.Filters.SetAll({});
        }

        // define global variable for util, or we can't use it later in initComplete function
        var util = $.fn.dataTable.util;

        // render DataTable
        let dataTable = $('#gundert-searchresult-table').DataTable({
            // for DataTable options see https://datatables.net/reference/option/
            order: [[sort_column_no, 'asc']],
            lengthMenu: [10, 25, 50, 100, 1000],
            responsive: true,
            stateSave: true,
            keys: true,
            "language": {
                "url": "vendor/jquery-datatables-plugins-fixes/i18n/" + Gundert.GetLanguageForDatatables() + ".json"
            },
            // manipulate table layout for page bar at top AND bottom
            // dom reference see: https://datatables.net/reference/option/dom
            dom: "<'row'<'col-sm-3'l><'col-sm-3'<'gundert_search_help'>f><'col-sm-6'p>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-5'i><'col-sm-7'p>>",

            // add column filter
            // for example, see: https://datatables.net/examples/api/multi_filter_select.html
            initComplete: function () {
                let column_no = 0;
                this.api().columns().every( function () {
                    let column = this;
                    let filter_id = column.header().textContent;
                    if (filter_column_numbers.includes(column_no)) {
                        let select = $('<select id="'+filter_id+'" class="ut-form__select ut-form__field"><option value=""></option></select>');
                        select.appendTo($(column.footer()).empty());
                        select.on('change', function(event) {
                            Gundert.Filters.Set(event.currentTarget.id, $(this).val());
                            let val = util.escapeRegex($(this).val());
                            if (val === '')
                                val = '.*';

                            // filter by using pattern for data-filter attribute
                            const sep = util.escapeRegex(Gundert.Separators.Filter);
                            const pattern = '(^\\s*'+val+'\\s*$)|(^\\s*'+val+'\\s*'+sep+')|('+sep+'\\s*'+val+'\\s*'+sep+')|('+sep+'\\s*'+val+'\\s*$)';
                            column
                                .search( pattern, true, false )
                                .draw();
                        });

                        let option_values = [];
                        column.data().unique().each(function (column_values, index) {
                            column_values.split(Gundert.Separators.Display).forEach(function(column_value) {
                                column_value = column_value.trim();
                                if (column_value != '' && !option_values.includes(column_value))
                                    option_values.push(column_value);
                            });
                        });

                        option_values.sort().forEach(function(option_value) {
                            let option = '<option value="' + option_value + '"';
                            if (option_value == Gundert.Filters.Get(filter_id)) {
                                option += ' selected';
                            }
                            option += '>' + option_value + '</option>';
                            select.append(option);
                        });
                    } else
                        $('').appendTo($(column.footer()).empty());

                    ++column_no;
                });

                // insert help button
                // see https://datatables.net/examples/advanced_init/dom_toolbar.html for example
                // (we use onclick instead of <a> element here, because it was impossible due to a CSS bug to make it black instead of red)
                $("div.gundert_search_help").html('<span class="ut-icon ut-icon-info-circled" role="img" aria-label="Info" onclick="window.location.href=\'/?page=help\';" style="cursor: pointer;"></span>');

                // Normalize characters in filter string
                $('#gundert-searchresult-table_filter input[type=search]').keyup(function () {
                    let table = $('#gundert-searchresult-table').DataTable();
                    table.search(
                        jQuery.fn.DataTable.ext.type.search.html(Gundert.NormalizeString(this.value))
                    ).draw();
                });
            }
        });

        // save old language for "HasLanguageChanged()"
        Gundert.SetOldLanguage();
    },

    /**
     * This is the main function, which should be called from the HTML pages.
     * (redirects to the active querying mechanism, including result rendering.)
     *
     * @param string category
     * @param bool add_headline
     */
    Search: function(category, add_headline=true) {
        const language = Gundert.GetLanguage();
        Gundert.Query(category, language, add_headline);
    },

    /**
     * Store old language to cache
     * (needed to check if language has been changed)
     */
    SetOldLanguage: function() {
        Gundert.Cache.Set('language_old', Gundert.GetLanguage());
    },

    /**
     * Show loader while datatables query is running
     *
     * @param string language
     */
    ShowLoader: function(language) {
        let innerHTML = '<div align="center"><span class="ut-icon ut-icon--animate-spin" role="img" aria-label="loading..."></span></div>';
        Gundert.GetOrCreateSearchResult(language, innerHTML);
    },
};
