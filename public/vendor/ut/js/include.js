/**
 * Sammlung allgemeiner Funktionen zur Steuerung
 * und Anpassunng kleinerer Frontend- und Bootstrap-Komponenten.
 *
 * @summary     Steuerung kleinerer Frontend-Komponenten.
 * author       Galileo Webagentur oHG
 * @requires    viewport.js, jquery.js
 *
 */

jQuery(document).ready(function ($) {

	// Viewport ermitteln und updaten
	// --------------------------------------------
	var isPhone = Gw.Viewport.isXsDown();
	var isMobile = Gw.Viewport.isSmDown();
	var isDesktop = Gw.Viewport.isMdUp();
	$(window).on('gw_viewportChanged', function () {
		isPhone = Gw.Viewport.isXsDown();
		isMobile = Gw.Viewport.isSmDown();
		isDesktop = Gw.Viewport.isMdUp();
	});

	// Breadcrumbs
	// --------------------------------------------
	$('.ut-breadcrumb__toggle-link').click(function () {
		$(this).toggleClass('ut-breadcrumb__toggle-link--is-active');
		$('.ut-breadcrumb__item--collapse').toggleClass('ut-breadcrumb__item--is-active');
	});

	// Nav-Vertical
	// --------------------------------------------
	$('.ut-nav--vertical .ut-nav__collapse-link').click(function () {
		$(this).toggleClass('ut-nav__collapse-link--is-active');
		$(this).children('.ut-nav__collapse-icon').toggleClass('ut-icon-minus').toggleClass('ut-icon-plus-2');
	});

	// Boostrap Komponenten
	// --------------------------------------------

	// Panels: Header mit Icons dekorieren
	$('.ut-panel:not(.ut-panel--collapsing-only-mobile) .ut-panel__collapse').on('shown.bs.collapse', function () {
		$(this).parent().find(".ut-panel__icon").removeClass("ut-icon-plus-2").addClass("ut-icon-minus");
	}).on('hidden.bs.collapse', function () {
		$(this).parent().find(".ut-panel__icon").removeClass("ut-icon-minus").addClass("ut-icon-plus-2");
	});
	$('.ut-panel--collapsing-only-mobile .ut-panel__collapse').on('shown.bs.collapse', function () {
		$(this).parent().find(".ut-panel__icon").removeClass("ut-icon-down-dir").addClass("ut-icon-up-dir");
	}).on('hidden.bs.collapse', function () {
		$(this).parent().find(".ut-panel__icon").removeClass("ut-icon-up-dir").addClass("ut-icon-down-dir");
	});
	// Panels: Collapse für Mobile-Panels auf Tablet und Desktop deaktivieren
	$('.ut-panel--collapsing-only-mobile .ut-panel__link').click(function (e) {
		if (!isPhone) {
			e.stopPropagation();
			e.preventDefault();
		}
	});

	// Tabs: Link mit zusätzlicher Klasse auszeichnen
	$('.ut-tab-list__link').on('shown.bs.tab', function () {
		$(this).parents('.ut-tab-list').find('.ut-tab-list__link').removeClass('active');
		$(this).addClass('active');
	});

	// Dropdowns: Dropdown und Toggle mit zusätzlicher Klasse auszeichnen
	$('.ut-dropdown').on('shown.bs.dropdown', function () {
		$(this).addClass("ut-dropdown--is-active");
		$(this).parent().find(".ut-dropdown__toggle").addClass("ut-dropdown__toggle--is-active");
	});
	$('.ut-dropdown').on('hidden.bs.dropdown', function () {
		$(this).removeClass("ut-dropdown--is-active");
		$(this).parent().find(".ut-dropdown__toggle").removeClass("ut-dropdown__toggle--is-active");
	});

	// Tooltips: Initialisierung
	$('[data-toggle="tooltip"]').tooltip();

	// Popover: Initialisierung
	$('[data-toggle="popover"]').popover();

	// Carousel: Start-/Stop-Schaltfläche für Bootstrap Carousel (BITV)
	$('[data-toggle="carousel"]').on('click', function () {
		var $this = $(this);
		var $icon = $('.ut-carousel__icon', this);
		var $carousel = $this.closest('.ut-carousel');
		var data = $carousel.data('bs.carousel');
		if (data.paused) {
			$carousel.carousel('cycle');
			$icon.removeClass('ut-carousel__play-icon')
				.addClass('ut-carousel__pause-icon');
		} else {
			$carousel.carousel('pause');
			$icon.removeClass('ut-carousel__pause-icon')
				.addClass('ut-carousel__play-icon');
		}
    });

	// Formular Validierung - Beispiel
	// --------------------------------------------
	$('.ut-form--contact').validate({
		errorClass: 'has-error',
		rules: {
			"email": {
				email: true
			}
		},
        messages: {
            "name": {
                required: "Bitte füllen Sie das Feld Name aus."
            },
            "email": {
                required: "Bitte füllen Sie das Feld E-Mail aus.",
				email: "Bitte geben Sie eine gültige E-Mail Adresse ein."
            },
			"message": {
                required: "Bitte füllen Sie das Feld Nachricht aus."
            }
        }
    });
});


