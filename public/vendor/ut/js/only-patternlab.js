// Javascript code, der nur innerhalb von Pattern Lab benötigt wird
// korrigiert fehler bei der Verarbeitung von JavaScript
+function ($) {
	"use strict";
	
	window.setTimeout(function () {
		// onclick handler entfernen, da sonst die Links immer ausgeführt werden
		$(function () {
			$('a[data-lightbox],' 
			  + 'a[data-slide]').each(function () {
				this.onclick = null;
			});
		});
	}, 100);

	$('a[href="#"]').on('click', function (e) {
		e.preventDefault();
    })
}(jQuery);