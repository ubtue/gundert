var Gundert = {

    // Fields for which filter <select> will be generated
    FilterFields: ['collection', 'languages', 'subject_ids'],

    /**
     * Build query URL by mapping
     *
     * @note The remote URL must support CORS!
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
     *
     * @param object mapping
     *
     * @return string
     */
    BuildQueryURL: function(mapping) {
        //var base_url = 'http://cicero.ub.uni-tuebingen.de:8984/basex/digi3f/list';
        var base_url = 'http://cicero.ub.uni-tuebingen.de/~wagner/cgi-bin/gundert-json.cgi';
        var suffix = '';
        for (var key in mapping['query']) {
            if (suffix == '') {
                suffix += '?';
            } else {
                suffix += '&';
            }
            suffix += key + '=' + mapping['query'][key];
        }
        return base_url + suffix;
    },

    /**
     * Get a translated display text matching the user's selected language
     *
     * @param string id
     *
     * @return string
     */
    GetDisplayText: function(id) {
        var language = Gundert.GetLanguage();
        if (GundertDisplayTexts.hasOwnProperty(language) && GundertDisplayTexts[language].hasOwnProperty(id)) {
            return GundertDisplayTexts[language][id];
        } else {
            return '#' + id + '#';
        }
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
        var language = Gundert.GetLanguage();
        switch (language) {
            case 'de':
                return 'German';
            case 'en':
                return 'English';
        }
        return 'English';
    },

    /**
     * Helper function to get only the first element with a certain class
     *
     * @param string classname
     * @return DomElement
     */
    GetFirstElementByClassName: function(classname) {
        var elements = document.getElementsByClassName(classname);
        return elements[0];
    },

    /**
     * creates a div element, which can be used to display the search result
     *
     * @param string language
     * @return DomElement
     */
    GetOrCreateSearchResult: function(language) {
        var div_search_result = document.getElementById('gundert-searchresult');
        if (div_search_result == undefined) {
            var div_parent = document.getElementById('gundert-contentmiddle');
            var div_container = document.createElement('div');
            div_container.setAttribute('class', 'container');
            div_container.innerHTML = '<div id="gundert-searchresult" class="gundert-result-'+language+'"></div>';
            div_container = div_parent.insertBefore(div_container, div_parent.firstChild.nextSibling);
            div_search_result = div_container.firstChild;
        }

        return div_search_result;
    },

    /**
     * Perform the search for a given category.
     * Sends query to remote server.
     *
     * @param string category
     * @param string language
     */
    Query: function(category, language) {
        Gundert.ShowLoader(language);
        var mapping = GundertCategoryMappings.GetMapping(category);
        var url = Gundert.BuildQueryURL(mapping);
        console.log("Query URL: " + url);
        $.ajax({
            url: url,
            success: function(result) {
                Gundert.RenderResult(category, language, mapping, result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                Gundert.RenderError();
            }
        });
    },

    /**
     * Perform the search for a given category.
     * The json is just taken from a local variable.
     * This is just a testing function, e.g. to use if the API is down.
     *
     * @param string category
     * @param string language
     */
    QueryDummyLocal: function(category, language) {
        Gundert.ShowLoader(language);
        var mapping = GundertCategoryMappings.GetMapping(category);
        var url = Gundert.BuildQueryURL(mapping);
        $.ajax({
            url: 'js/dummydata2.json',
            success: function(result) {
                Gundert.RenderResult(category, language, mapping, result);
            }
        });
    },

    /**
     * Show errors
     */
    RenderError: function() {
        var div_search_result = Gundert.GetOrCreateSearchResult('error');
        div_search_result.innerHTML = '<font color="red">SORRY! The external information could not be received, please try again later.</font>';
    },

    /**
     * Converts the data from the JSON result
     * into a HTML table.
     *
     * @param string category
     * @param string language
     * @param object mapping
     * @param JsonObject data
     */
    RenderResult: function(category, language, mapping, data) {
        // Prepare result HTML
        var table = '';
        var fields = mapping['result'];
        var filter_column_numbers = [];

        // headline
        table += '<h1>'+Gundert.GetDisplayText(category)+'</h1>';

        // table header
        table += '<table id="gundert-searchresult-table" class="ut-table gundert-language-'+language+'">';
        table += '<thead class="ut-table__header">';
        table += '<tr class="ut-table__row">';
        var th_section = '';
        var column_no = 0;
        fields.forEach(function(field) {
            th_section += '<th class="ut-table__item ut-table__header__item">'+Gundert.GetDisplayText(field)+'</th>';
            if (Gundert.FilterFields.includes(field))
                filter_column_numbers.push(column_no);
            ++column_no;
        });
        table += th_section;
        table += '</tr>';
        table += '</thead>';

        // table body
        table += '<tbody>';
        data.forEach(function(row) {
            table += '<tr class="ut-table__row">';
            fields.forEach(function(field) {
                table += '<td class="ut-table__item ut-table__body__item">';
                var column = row[field];

                // unify values
                var values = [];
                if (Array.isArray(column)) {
                    column.forEach(function(value) {
                       values.push(value);
                    });
                } else if (column !== undefined)
                    values.push(column);

                // translate if necessary
                var value_nr = 0;
                values.forEach(function(value) {
                    if (value != "") {
                        ++value_nr;
                        if (value_nr > 1) {
                            table += '<br/>';
                        }
                        if (GundertCategoryMappings.TranslatableFields.includes(field)) {
                            table += Gundert.GetDisplayText(value);
                        } else if (field == 'title') {
                            if (row.projectname == undefined)
                                table += value;
                            else {
                                var export_version = row['export_version'];
                                var generate_link = (export_version !== undefined && export_version > 0);
                                if (generate_link) {
                                    url = 'http://idb.ub.uni-tuebingen.de/diglit/'+ row.projectname + '/';
                                    if (language == 'en')
                                        url += '?ui_lang=eng';
                                    table += '<a href="' + url + '" target="_blank">';
                                }
                                table += value;
                                if (generate_link)
                                    table += '</a>';
                            }
                        } else if (field == 'collection') {
                            table += Gundert.GetDisplayText(field + '_' + value);
                        } else {
                            table += value;
                        }
                    }
                });
                table += '</td>';
            });

            table += '</tr>';
        });
        table += '</tbody>';
        table += '<tfoot>';
        table += th_section;
        table += '</tfoot>';
        table += '</table>';

        // Trigger DataTable plugin
        var div_search_result = Gundert.GetOrCreateSearchResult(language);
        div_search_result.innerHTML = table;

        // set custom css classes
        $.fn.dataTable.ext.classes.sFilterInput = 'ut-form__input';
        $.fn.dataTable.ext.classes.sLengthSelect = 'ut-form__select';
        $.fn.dataTable.ext.classes.sPageButton = 'ut-btn';
        $.fn.dataTable.ext.classes.sPageButtonActive = 'active';


        var dataTable = $('#gundert-searchresult-table').DataTable({
            // put DataTable options here
            // see https://datatables.net/reference/option/
            responsive: true,
            keys: true,
            "language": {
                //local url doesnt work (though correct file is downloaded)... but works with cdn path. Strange!
                //"url": "vendor/jquery-datatables-plugins/i18n/" + Gundert.GetLanguageForDatatables() + ".json"
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/"+Gundert.GetLanguageForDatatables()+".json"
            },
            // manipulate table layout for page bar at top AND bottom
            // dom reference see: https://datatables.net/reference/option/dom
            dom: "<'row'<'col-sm-3'l><'col-sm-3'f><'col-sm-6'p>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-5'i><'col-sm-7'p>>",

            // add column filter
            // for example, see: https://datatables.net/examples/api/multi_filter_select.html
            initComplete: function () {
                var column_no = 0;
                this.api().columns().every( function () {
                    var column = this;
                    if (filter_column_numbers.includes(column_no)) {
                        var select = $('<select><option value=""></option></select>');
                        select.appendTo($(column.footer()).empty());
                        select.on( 'change', function() {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );
                                    var pattern = '^('+val+')|('+val+'<br>.*)|(.*<br>'+val+'<br>.*)|(.*<br>'+val+')$';
                                    column
                                        .search( pattern, true, false )
                                        .draw();
                                });

                        var option_values = [];
                        column.data().unique().each(function (column_values, index) {
                            column_values.split('<br>').forEach(function(column_value) {
                                column_value = column_value.trim();
                                if (!option_values.includes(column_value))
                                    option_values.push(column_value);
                            });
                        });

                        option_values.sort().forEach(function(option_value) {
                            select.append('<option value="'+option_value+'">'+option_value+'</option>');
                        });
                    } else
                        $('').appendTo($(column.footer()).empty());

                    ++column_no;
                });
            }
        });
    },

    /**
     * This is the main function, which should be called from the HTML pages.
     * (redirects to the active querying mechanism, including result rendering.)
     *
     * @param string category
     * @param string language
     */
    Search: function(category) {
        var language = Gundert.GetLanguage();
        Gundert.Query(category, language);
        //Gundert.QueryDummyLocal(category, language);
    },

    /**
     * Show loader while datatables query is running
     *
     * @param string language
     */
    ShowLoader: function(language) {
        var div_search_result = Gundert.GetOrCreateSearchResult(language);
        div_search_result.innerHTML = '<div align="center"><span class="ut-icon ut-icon--animate-spin" role="img" aria-label="loading..."></span></div>';
    },
};
