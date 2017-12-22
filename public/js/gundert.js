var Gundert = {

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
            div_container.innerHTML = '<div id="gundert-searchresult" class="gundert-language-'+language+'"></div>';
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
        $.ajax({
            url: 'http://cicero.ub.uni-tuebingen.de:8984/basex/digi3f/list?sammlung=52+22+23',
            success: function(result) {
                Gundert.RenderResult(category, language, result);
            }
        });
    },

    /**
     * Perform the search for a given category.
     * The json is just called from a URL without api.
     * This is just a testing function, e.g. to use if the API is down.
     *
     * @param string category
     * @param string language
     */
    QueryDummyRemote: function(category, language) {
        Gundert.ShowLoader(language);
        $.ajax({
            url: 'js/dummydata.json',
            success: function(result) {
                Gundert.RenderResult(category, language, result);
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
        $.ajax({
            url: 'js/dummydata.json',
            success: function(result) {
                Gundert.RenderResult(category, language, result);
            }
        });
    },

    /**
     * Converts the data from the JSON result
     * into a HTML table.
     *
     * @param string category
     * @param string language
     * @param JsonObject data
     */
    RenderResult: function(category, language, data) {
        // Prepare result HTML
        var table = '';

        //dummy fields
        var fields = ["signature", "author", "title", "released", "type", "volume"];
        //real fields
        //var fields = ["title", "type", "author", "projectname"];

        // headline
        table += '<h1>'+Gundert.GetDisplayText(category)+'</h1>';

        // table header
        table += '<table id="gundert-searchresult-table" class="ut-table gundert-language-'+language+'">';
        table += '<thead class="ut-table__header">';
        table += '<tr class="ut-table__row">';
        fields.forEach(function(field) {
            table += '<th class="ut-table__item ut-table__header__item">'+Gundert.GetDisplayText(field)+'</th>';
        });
        table += '</tr>';
        table += '</thead>';

        // table body
        table += '<tbody>';
        data.forEach(function(row) {
            table += '<tr class="ut-table__row">';
            fields.forEach(function(field) {
                table += '<td class="ut-table__item ut-table__body__item">'+row[field]+'</td>';
            });

            table += '</tr>';
        });
        table += '</tbody>';

        table += '</table>';

        // Trigger DataTable plugin
        var div_search_result = Gundert.GetOrCreateSearchResult(language);
        div_search_result.innerHTML = table;

        $('#gundert-searchresult-table').DataTable({
            // put DataTable options here
            // see https://datatables.net/reference/option/
            responsive: true,
            "language": {
                //local url doesnt work (though correct file is downloaded)... but works with cdn path. Strange!
                //"url": "vendor/jquery-datatables-plugins/i18n/" + Gundert.GetLanguageForDatatables() + ".json"
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/"+Gundert.GetLanguageForDatatables()+".json"
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
        //Gundert.Query(category, language);
        Gundert.QueryDummyLocal(category, language);
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
