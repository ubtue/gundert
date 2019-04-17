/**
 * Ermöglicht es Elemente, abhängig von der Bildschirmauflösung
 * bzw. des Viewports, in Containern anzuordnen.
 *
 * @summary     Reorganisierung von Elementen für Viewports.
 * author       Galileo Webagentur oHG
 * @requires    viewport.js, jquery.js
 *
 */


+function ($) {
	'use strict';
	
	// Verfügbare viewports
	var _viewports = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];
	// Aktueller viewport
	var _viewport = false;
	
	// Array von Elementen (jQuery Objekte), die umgeordnet werden sollen
	var $elements = $();
	
	var init = function () {
		var $containers = $();
		var elements = [];
		$('[data-reorganize]').each(function () {
			var $this = $(this);
			if ($this.data('reorganize-on')) {
				var $container = $($this.data('reorganize'));
				if ($container.length !== 1) {
					console.error('no unique reorganize container found');
					return;
				}
				var viewports = $this.data('reorganize-on').split(',');
				var initial_viewports = $(_viewports).not(viewports).get();
				$this.data('initial_viewports', initial_viewports);
				if (viewports.length > 0) {
					var $placeholder = createPlaceholder($this.data('reorganize-position'));
					for (var it in viewports) {
						//noinspection JSUnfilteredForInLoop
						$this.data('placeholder-' + viewports[it], $placeholder);
					}
					$container.append($placeholder);
					$containers = $containers.add($container);
				}
				if (initial_viewports.length) {
					var $placeholder = createPlaceholder();
					for (var it in initial_viewports) {
						//noinspection JSUnfilteredForInLoop
						$this.data('placeholder-' + initial_viewports[it], $placeholder);
						$placeholder.insertAfter($this);
					}
				}
				elements.push($this);
			} else {
				var initial_viewports = _viewports;
				// Placeholder-Boxen für alle vorhandenen data-reorganize-[viewport] Attribute erzeugen
				for (var it in _viewports) {
					//noinspection JSUnfilteredForInLoop
					var viewport = _viewports[it];
					var container = $this.data('reorganize-' + viewport);
					if (typeof container === 'undefined') {
						continue;
					}
					var $container = $(container);
					if ($container.length === 0) {
						console.error('no unique reorganize container found');
						return;
					}
					var $placeholder = createPlaceholder($this.data('reorganize-' + viewport + '-position'));
					$this.data('placeholder-' + viewport, $placeholder);
					$container.append($placeholder);
					$containers = $containers.add($container);
					initial_viewports = $(initial_viewports).not([viewport]).get();
				}
				// Für alle nicht gesetzten viewport Werte, eine default-Box erzeugen
				if (initial_viewports.length) {
					var $placeholder = createPlaceholder().addClass('ro-default');
					for (var it in initial_viewports) {
						//noinspection JSUnfilteredForInLoop
						$this.data('placeholder-' + initial_viewports[it], $placeholder);
						$placeholder.insertAfter($this);
					}
				}
				elements.push($this);
			}
			$elements = $(elements);
		});
		
		// Platzhalter-Elemente entsprechend ihrer Position in den Containern sortieren
		$containers.each(function () {
			var $container = $(this);
			$('.ro-placeholder', this).sort(function (a, b) {
				// Sortierung der Elemente
				// Da die negativen Elemente mit Prepend eingefügt werden, müssen diese umgekehrt sortiert werden
				// z.B: ... -1 -2 -5 0 1 2 5 ...
				var pa = $(a).data('position'),
					pb = $(b).data('position');
				return pa < 0 && pb < 0 ? pb - pa : pa - pb;
			}).each(function () {
				var $this = $(this);
				var pos = $this.data('position');
				if (pos < 0)
					$container.prepend($this);
				else 
					$container.append($this);
			});
		});
	};
	
	// Platzhalter Element erzeugen
	var createPlaceholder = function (position) {
		position = typeof position === 'undefined' ? 0 : parseInt(position);
		return $('<div />')
			.addClass('ro-placeholder')
			.addClass('hidden')
			.data('placeholder', true)
			.data('position', position);
	};
	
	// Initialisieren
	init();
	
	$(window).on('gw_viewportChanged', function () {
		var viewport = Gw.Viewport.get();
		// Keine Änderung seit letztem Aufruf?
		if (viewport === _viewport) {
			return;
		}
		// Elemente neu anordnen
		$elements.each(function () {
			var $this = $(this);
			$this.insertAfter($this.data('placeholder-' + viewport));
		});
		_viewport = viewport;
	});
}(jQuery);