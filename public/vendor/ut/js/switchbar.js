/**
 * Steuerung des Umschalters (Switchbar) zwischen
 * Navigationsfunktionen im Kopfbereich der Website
 * in Mobile- sowie Desktop Viewports.
 *
 * @summary     Steuerung der Switchbar.
 * author       Galileo Webagentur oHG
 * @requires    viewport.js, jquery.js
 *
 */

/**
 * Switchbar initialisieren und Klickfunktionen bereitstellen
 */

jQuery(document).ready(function ($) {

	// Viewport prüfen / setzen
	var isMobile = Gw.Viewport.isSmDown();

	// Klick-Funktion: Öffen
	$('.ut-switchbar__toggle[data-target]').click(function (event) {
		toggleSwitchbar(event, $(this), $(this).attr('data-target'));
	});

	// Klick-Funktion: Schließen
	$('.ut-switchblock__close-icon').click(function () {
		switchbarClose(null, "all");
	});

	// Klick-Funktion: Schließen bei Klick außerhalb
	$(document).on('click', function (ev) {
		var dontHideMenuOnClickSelector = '.ut-switchbar, .ut-switchbar *, .ut-switchblock__item, .ut-switchblock__item *';
		if (!$(ev.target).is(dontHideMenuOnClickSelector)) {
			switchbarClose(null, "all");
		}
	});

	// Viewport bei Resize prüfen, ggf. Menus schließen
	$(window).on('gw_viewportChanged', function () {
		if ((isMobile && Gw.Viewport.isMdUp()) || (!isMobile && Gw.Viewport.isSmDown())) {
			switchbarClose(null, "all");
			isMobile = Gw.Viewport.isSmDown();
		}
	});
});

/**
 * Steuerung des Umschalters (Switchbar)
 *
 * @param {Object} toggleItem - Toggle-Button
 * @param {Object} target - Ziel des Buttons (DOM-Element)
 */
function toggleSwitchbar(event, toggleItem, target) {

	event.stopPropagation();

	var target = $('' + target);
	if (toggleItem.attr('aria-expanded') === 'false') {
		switchbarClose(null, "all");
		switchbarOpen(toggleItem, target);
	}
	else {
		switchbarClose(toggleItem, target);
	}
}

/**
 * Switchbar-Element öffen
 *
 * @param {Object} toggleItem - Toggle-Button
 * @param {Object} target - Ziel des Buttons (DOM-Element)
 */
function switchbarOpen(toggleItem, target) {
	// Ausrichtung der rechten Kante der Switchbar-Boxen an öffnendem Link
	if (Gw.Viewport.isMdUp()) {
		var offsetRight = $('.ut-page-header__container').width() - parseInt(toggleItem.position().left)
		                  - toggleItem.width();
		$(target).css('right', offsetRight + 'px');
	}
	// DOM-Elemente dekorieren
	target.addClass('ut-switchblock__item--is-active');
	toggleItem.addClass('ut-switchbar__toggle--is-active');
	toggleItem.attr('aria-expanded', 'true');
	$('body').attr('data-menu-expanded', 'true');
	$('html').addClass('js-state__ut-switchbar-is-open');
	$('html').removeClass('js-state__ut-switchbar-is-closed');
}

/**
 * Switchbar schließen
 *
 * @param {Object} toggleItem - Toggle-Button
 * @param {Object} target - Ziel des Buttons (DOM-Element)
 */
function switchbarClose(toggleItem, target) {
	if (target === "all") {
		$('.ut-switchblock__item').removeClass('ut-switchblock__item--is-active');
		$('.ut-switchbar__toggle').removeClass('ut-switchbar__toggle--is-active');
		$('.ut-switchbar__toggle').attr('aria-expanded', 'false');
	}
	else {
		target.removeClass('ut-switchblock__item--is-active');
		toggleItem.removeClass('ut-switchbar__toggle--is-active');
		toggleItem.attr('aria-expanded', 'false');
	}
	$('body').attr('data-menu-expanded', 'false');
	$('html').addClass('js-state__ut-switchbar-is-closed');
	$('html').removeClass('js-state__ut-switchbar-is-open');
}
