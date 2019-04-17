/**
 * Steuerung der Hauptnavigation der UT-Website
 * in Mobile- und Desktop Viewports sowie dynamische Erzeugung
 * der Sekundärnavigation für Desktops.
 *
 * @summary     Steuerung der Hauptnavigation.
 * author       Galileo Webagentur oHG
 * @requires    viewport.js, jquery.min.js
 *
 */

+function ($) {
	'use strict';
	
	// Toggle Link Klasse
	var toggle = '.ut-nav--main .ut-nav__toggle-link';
	var toggleClass = 'ut-nav__toggle-link';
	
	// Klasse für Untermenüs
	var subnavs = '.ut-nav__list, .ut-nav__append';
	
	// Navigation initalisieren
	var Nav = function (element) {
		$(element).on('click.gw.ut-nav', this.toggle)
	};

	// Viewport ermitteln und updaten
	var desktop = Gw.Viewport.isMdUp();
	$(window).on('gw_viewportChanged', function () {
		desktop = Gw.Viewport.isMdUp();
	});

	// HTML mit Zustandsklasse markieren
	$('html').addClass('js-state__ut-nav-is-closed');

	/**
	 * Toggle Funktion.
	 * 
	 * Wird beim klick auf einen Toggle Button für das Menü ausgeführt.
	 * Kümmert sich darum, dass die Menüs geöffnet/geschlossen werden
	 * und alle Klassen richtig gesetzt sind.
	 * 
	 * @param e
	 * @returns {boolean}
	 */
	Nav.prototype.toggle = function (e) {
		var $this = $(this);

		// Fall: Deaktiviert --> abbrechen
		if ($this.is('.disabled, :disabled, .ut-nav__toggle-link--is-disabled')) {
			return;
		}

		// Elemente initialisieren
		var $parent = getParent($this);
		var isActive = $parent.hasClass('ut-nav__item--is-open');
		var $nav = getNav($this);
		var $items = $this.parents('.ut-nav__item--is-open');
		var $navsToClose = $('.ut-nav__item--is-open', $nav).not($items);

		// Fall: Bereits aktiv --> aktualisieren
		if (isActive) {
			$navsToClose = $navsToClose.add($parent);

			// HTML mit Zustandsklasse markieren
			$('html').addClass('js-state__ut-nav-is-closed');
			$('html').removeClass('js-state__ut-nav-is-open');
		}
		$navsToClose.each(function () {
			var toggleLink = $('.' + toggleClass, this)[0];
			closeNav(toggleLink, e);
		});

		// Aktiven Toggle (de-)markieren
		$('.ut-nav--is-active').removeClass('ut-nav--is-active');
		$this.toggleClass('ut-nav--is-active', !isActive);

		// Fall: Nicht aktiv
		if (!isActive) {
			var relatedTarget = {relatedTarget : this};
			$parent.trigger(e = $.Event('show.gw.ut-nav', relatedTarget));
			$this.trigger('focus');

			// Geöffnete Liste markieren
			$parent.addClass('ut-nav__item--is-open');
			$parent.trigger('shown.gw.ut-nav', relatedTarget);

			// Carousels stoppen
			$('.carousel').carousel('pause');

			// Nav innerhalb von secondary nur auf dem Desktop öffnen
			if (desktop) {
				var $secondary = getSecondary($nav);
				if ($secondary.length) {
					var $subnavs = getSubnavs($this);
					$this.data('subnavs', $subnavs);
					// Untermenüs anzeigen
					$subnavs.each(function () {
						var $subnav = $(this);
						$subnav.data('old-parent', $subnav.parent());
						$subnav.addClass(getMainClass($subnav) + '--is-open');
						$secondary.append($subnav);
					});
					// Klasse auf Secondary Container setzten
					if ($subnavs.length) {
						$secondary.removeClass('ut-nav--is-closed');
						$secondary.data('toggle-link', $this);
					}
				}
			}

			// HTML mit Zustandsklasse markieren
			$('html').removeClass('js-state__ut-nav-is-closed');
			$('html').addClass('js-state__ut-nav-is-open');
		}

		return false
	};
	
	// 
	/**
	 * Schließen Button innerhalb von Menüs.
	 * 
	 * Schließt die aktuell offene Ebene des Menüs.
	 * Ruft intern die Toggle Funktion über ein simuliertes Click-Event auf.
	 * 
	 * @param e
	 */
	Nav.prototype.closeLevel = function (e) {
		// Klick auf den (verborgenen) aktuellen Toggle-Button simulieren und Event Bubbling abbrechen
		$('.ut-nav__toggle-link', $(this).closest('.ut-nav__item--is-open')).first().click();
		e.preventDefault();
	    e.stopPropagation();
	};
	
	/**
	 * Tastaturnavigation für die Menüs.
	 * 
	 * Reagiert auf die Pfeiltasten + Esc.
	 * Die Pfeiltasten werden zum Navigieren verwendet, Esc schließt das Menü.
	 * 
	 * Diese Funktion ist nur auf dem Desktop aktiv.
	 * 
	 * @param e
	 */
	Nav.prototype.keydown = function (e) {
		if (!/(37|38|39|40|27|9|13)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

		// Für Mobilversion nicht verwenden
		if (!desktop) {
			Nav.prototype.mobileKeydown.bind(this)(e);
			return;
		}
		
	    var $this = $(this),
	        $toggle = $this,
	        key = e.which;
	
		var bubble = false;
	    
		var isOpen = isNavOpen(1);
		var $focus = getFocusNavItem(1);
		var tab = false;
		
		if (key === 9) {
			var tab = true;
			if (isOpen) {
				if (!$focus.length) key = e.shiftKey ? 38 : 40;
				else key = e.shiftKey ? 37 : 39;
            }
			else key = e.shiftKey ? 37 : 39;
		}
		
	    // Rechts(39) / Links(37) Pfeiltasten behandeln
	    if (key === 37 || key === 39) {
	    	// Falls der Fokus bereits auf einem Untermenüpunkt ist
	    	if (!$focus.length) {
	    		$focus = getOpenNavItem(1);
		    }
	    	var $nextNavItem = key === 37 ? $focus.prev() : $focus.next();
	    	if ($nextNavItem.is(':visible')) {
	    		var $nextLink = $('.ut-nav__link--level-1', $nextNavItem).first();
	    		var $nextToggle = $('.ut-nav__toggle-link', $nextNavItem).first();
	    		// Focus setzten
	    		$nextLink.trigger('focus');
	    		if (isOpen) {
	    			if ($nextToggle.length) {
	    				// Nächstes Menü anzeigen
	    				$nextToggle.click();
				    } else {
	    				// Menü schließen, wenn keines vorhanden
	    				clearNavs(e);
				    }
			    }
		    } else if (tab) {
	    		bubble = true;
			}
		    return returnBubble(e, bubble);
	    }
		
	    // Passenden toggle-link suchen
	    if (!$this.hasClass(toggleClass)) {
	    	var $secondary = $this.closest('.ut-nav__flyout');
	    	if ($secondary.length) {
	    		$toggle = $secondary.data('toggle-link'); 
		    } else {
		        $toggle = $(e.target).siblings('.ut-nav__toggle-link');
		    }
		    if ($toggle.length === 0) {
	    		return returnBubble(e, bubble);
		    }
	    }
	    
	    if ($toggle.is('.disabled, :disabled')) return;

	    var $parent = getParent($toggle);
	    var isActive = $parent.hasClass('ut-nav__item--is-open');

	    if (!isActive && (key === 40 || key === 13) || isActive && key === 27) {
	    	if (key === 27) $parent.find(toggle).trigger('focus');
	    	if (key === 13) key = 40;
		    $toggle.trigger('click');
		    if (isActive) {
		    	return returnBubble(e, bubble);
		    }
	        // Kein Return => Focus gleich auf erstes Element setzten
	    }
	    
	    // Innerhalb des Menü hoch(38)/runter(40) navigieren
	    if (key === 38 || key === 40) {
		    var $secondary = getSecondary(getNav($toggle));
		    
		    var $items = $('.ut-nav__link.ut-link:visible:not(ut-nav__toggle-link)', $secondary);
		    if (!$items.length) return;

		    // aktuell gewähltes item
		    var index = $items.index(e.target);
		    var currentIndex = index;

		    // Aus dem Untermenü auf die Hauptebene springen (Pfeil-nach-oben + Index 0)
		    if (key === 38 && index === 0) {
		    	// Focus auf Hauptpunkt setzten
			    var $toggleLink = $secondary.data('toggle-link');
			    $toggleLink.trigger('focus');
			    $toggleLink.click();
		    	return returnBubble(e,  bubble);
		    }
		    
		    if (key === 38 && index > 0) index--;
		    if (key === 40 && index < $items.length - 1) index++;
		    if (!~index) index = 0;
		    
		    if (index === currentIndex && tab && key === 40) {
		    	var $toggleLink = $secondary.data('toggle-link');
			    $toggleLink.trigger('focus');
			    $toggleLink.click();
		    	return returnBubble(e,  true);
			} else {
				$items.eq(index).trigger('focus');
			}
	    }
	    return returnBubble(e, bubble);
	};

    /**
	 * Alternatives Keyboard verhalten für Mobiles Menü
     * @param e
     */
    Nav.prototype.mobileKeydown = function (e) {
    	if (e.which !== 9 || e.shiftKey) {
    		return;
		}

    	var isOpen = $('#switchblock-menu.ut-switchblock__item--is-active');
    	if (isOpen) {
    		var $link = $('.ut-nav__link--level-1:focus');
    		var $last = $('.ut-nav__item--level-1:last-child .ut-nav__link--level-1');

    		if ($link.is($last)) {
                $('.ut-nav__item--level-1:first-child .ut-nav__link--level-1').focus();
                e.preventDefault();
			}
		}
    };

	function returnBubble(e, bubble) {
		// Event Bubbling abbrechen?
		if (bubble) {
			return true;
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
    }
	
	/**
	 * Schließt alle Menüs.
	 * 
	 * @param e
	 */
	function clearNavs(e) {
		if (e && e.which === 3) {
			return;
		}
		// Menus schließen, demarkieren
		$('.ut-nav--is-active').removeClass('ut-nav--is-active');
		var closed = false;
		$(toggle).each(function () {
			closeNav(this, e);
			closed |= $(this).hasClass('ut-nav--is-active');
		});
		// Carousels (re)aktivieren
		!closed || $('.carousel').carousel('cycle');

		// HTML mit Zustandsklasse markieren
		$('html').removeClass('js-state__ut-nav-is-open');
		$('html').addClass('js-state__ut-nav-is-closed');
	}

	/**
	 * Schließt eine bestimmte Navigation.
	 * 
	 * @param toggle
	 * @param e
	 */
	function closeNav(toggle, e) {
		var $item = $(toggle);
		var $parent = getParent($item);
		var relatedTarget = {relatedTarget : toggle};
		if (!$parent.hasClass('ut-nav__item--is-open')) {
			return;
		}
		$parent.trigger(e = $.Event('hide.gw.ut-nav', relatedTarget));
		// Menü schließe verhindern?
		if (e.isDefaultPrevented()) {
			return;
		}

		// Subnavs zurück verschieben
		var $subnavs = $item.data('subnavs');
		if ($subnavs) {
			$subnavs.each(function () {
				var $subnav = $(this);
				var $subnavOldParent = $subnav.data('old-parent');
				$subnavOldParent.append($subnav);
				$subnav.removeClass(getMainClass($subnav) + '--is-open');
			});
		}
		
		var $secondary = getSecondary(getNav($item));
		$secondary.addClass('ut-nav--is-closed');
		$parent.removeClass('ut-nav__item--is-open');
		
		$parent.trigger('hidden.gw.ut-nav', relatedTarget);
	}

	/**
	 * Prüft, ob ein Menü geöffnet ist.
	 * 
	 * Lässt sich über den level Parameter auf ein bestimmtes Menü-Level einschränken.
	 * 
	 * @param {int|undefined} level
	 * @returns {boolean}
	 */
	function isNavOpen(level) {
		var $open = $('.ut-nav__item--is-open');
		if (typeof level === 'undefined') {
			return $open.length > 0;
		}
		return $open.is('.ut-nav__item--level-' + level);
	}

	/**
	 * Gibt das Menüelement zurück, das aktuell den Fokus hat.
	 * 
	 * Lässt sich über den level Parameter auf ein bestimmtes Menü-Level einschränken.
	 * 
	 * @param {int|undefined} level
	 * @returns $
	 */
	function getFocusNavItem(level) {
		var itemSelector = typeof level === 'undefined' ? '.ut-nav__item' : '.ut-nav__item--level-' + level;
		return $(itemSelector + ' .ut-nav--focus, ' + itemSelector + ' > a:focus').closest('.ut-nav__item');
	}

	/**
	 * Gibt das aktuell geöffnete Menüelement zurück
	 * 
	 * Lässt sich über den level Parameter auf ein bestimmtes Menü-Level einschränken.
	 * 
	 * @param {int|undefined} level
	 * @returns $
	 */
	function getOpenNavItem(level) {
		return $('.ut-nav__item.ut-nav__item--is-open' + (typeof level === 'undefined' ? '' : '.ut-nav__item--level-' + level));
	}

	/**
	 * Gibt zu einem Element das nähste Menüelement zurück
	 * @param $this
	 * @returns $
	 */
	function getParent($this) {
		return $this.closest('.ut-nav__item');
	}

	/**
	 * Gibt zu einem Toggle-Link die zugehörigen Subnavs zurück.
	 * 
	 * Dies beinhaltet Subnav + Append Element
	 * 
	 * @param $this
	 * @returns $
	 */
	function getSubnavs($this) {
		return getParent($this).children(subnavs);
	}

	/**
	 * Gibt zu einem Element (z.B. Toggle-Link) das nähste Menü zurück.
	 * 
	 * @param $this
	 * @returns $
	 */
	function getNav($this) {
		return $this.closest('.ut-nav__list');
	}

	/**
	 * Gibt zu einem Menü das Sekundär-Menü zurück.
	 *
	 * Innerhalb des Sekundärmenü wird auf dem Desktop die ausgeklappte Navigation
	 * dargestellt.
	 * 
	 * @param $nav
	 * @returns $
	 */
	function getSecondary($nav) {
		return $nav.siblings('.ut-nav__flyout');
	}

	/**
	 * Gibt die Haupt Css Klasse für ein Element zurück.
	 * 
	 * @param $element
	 * @returns string|boolean
	 */
	function getMainClass($element) {
		var classList = $($element).attr('class').split(/\s+/);
		for (var i = 0; i < classList.length; i++) {
		    if (!/--/.test(classList[i])) {
		    	return classList[i];
		    }
		}
		return false;
	}

	/**
	 * Initialisiert das Menü.
	 */
	function init() {
		$('.ut-nav.ut-nav--main').each(function() {
			var $nav = $(this);
			var $secondary = $('<div />')
				.addClass('ut-nav__flyout ut-nav--is-closed');

			$nav.append($secondary);
		});
	}

	// .ut-nav--focus Klassen auf Hauptmenüpunkt Gruppen setzten, wenn diese den Focus haben
	$(document).on('blur', '.ut-nav__item--level-1 .ut-nav__link-group > a', function () {
		$(this).parent().removeClass('ut-nav--focus');
	}).on('focus', '.ut-nav__item--level-1 .ut-nav__link-group > a', function () {
		if (desktop) {
			$(this).parent().addClass('ut-nav--focus');
		}
	});
	
	$(function() {
		// Navigation einklappen, wenn viewport geändert wird
		$(window).on('gw_viewportChanged', function (e) {
			clearNavs(e);
		});
	});
	
	// tab focus für nav-toggle links entfernen
	$('.ut-nav__link ~ .ut-nav__toggle-link').attr('tabIndex', '-1');

	$(document)
		.on('click.gw.ut-nav.data-api', clearNavs)
		.on('click.gw.ut-nav.data-api', toggle, Nav.prototype.toggle)
		.on('keydown.gw.ut-nav.data-api', toggle, Nav.prototype.keydown)
		.on('click.gw.ut-nav.data-api', '.ut-nav__link--close-level', Nav.prototype.closeLevel)
	    .on('keydown.gw.ut-nav.data-api', '.ut-nav__list', Nav.prototype.keydown);

	$(init);
}(jQuery);
