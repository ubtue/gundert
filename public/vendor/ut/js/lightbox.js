/**
 * Einbindung und Initalisierung der JS-Lightbox
 * "Magnific Popup"
 *
 * @summary     Lightbox einbinden.
 * author       Galileo Webagentur oHG
 * @requires    jquery.magnific-popup.js, jquery.js
 *
 */

jQuery(document).ready(function ($) {

	// Magnific Popup: Initialisieren
	var applyLightbox = function ($e) {
		var options = {
			type : 'image', tLoading : 'Lade Bild...', tClose : 'Schließen (Esc)'
		};
		if ($e.length > 1) {
			options.gallery = {
				enabled : true,
				navigateByImgClick : true,
				preload : [0, 1],
				tCounter : '%curr% von %total%',
				tPrev : 'Zurück (Linke Pfeiltaste)',
				tNext : 'Vorwärts (Rechte Pfeiltaste)'
			};
		}
		$e.magnificPopup(options);
	};

	// Gruppen für die Ansicht erstellen
	var lighboxGroups = {};
	$('a[data-lightbox]').each(function () {
		var $this = $(this), name = ($this.data('lightbox') || false);
		if (name) {
			lighboxGroups[name] = (lighboxGroups[name] || $()).add($this);
		}
		else {
			applyLightbox($this)
		}
	});

	// Lightbox auf die Gruppen anwenden
	$.each(lighboxGroups, function (name, $elements) {
		applyLightbox($elements);
	});

});



