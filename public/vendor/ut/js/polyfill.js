/**
 * Einbindung von Polyfills unter Berücksichtigung von Modernizr-Tests
 * sowie unter Zuhilfenahme von yepnope.
 *
 * @summary     Polyfills einbinden.
 * author       Galileo Webagentur oHG
 * @requires    yepnope.js, modernizr.js
 *
 */

// Fall: Picture-Tag wird nicht unterstützt
if (!Modernizr.picture) {
	// Polyfill: Picturefill einbinden
	yepnope.injectJs('../../js/vendor/picturefill/picturefill.min.js');
}

// Fall: REM-Einheiten werden nicht unterstützt
if (!Modernizr.cssremunit) {
	// Polyfill: REM einbinden
	yepnope.injectJs('../../js/vendor/rem-polyfill/rem.min.js');
}