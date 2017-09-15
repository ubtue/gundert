// Globalen Namespace definieren:
var Gw = Gw || {};

/**
 * Klasse zum Abarbeiten von verschiedenen Viewports
 * 
 * Utility-Klasse, die das Abfragen des Client Viewports übernimmt.
 * 
 * @type {{hasChanged, equalsXs, equalsSm, equalsMd, equalsLg, minXs, minSm, minMd, minLg, maxXs, maxSm, maxMd, maxLg}}
 */
Gw.Viewport = (function() {
	/**
	 * Konstanten-Objekt, dass verschiedene Viewportgrößen zurückgibt.
	 * 
	 * @type {{get}}
	 */
	var sizes = (function() {
		/**
		 * Eigentliche Viewport, denen ein Integer aufsteigender Reihenfolge zugewiesen wird
		 * 
		 * Jeder Viewport hat einen Namen zum Zugriff (bspw. xs), dem eine eindeutige Zahl gewiesen wird. Diese
		 * Zahl repräsentiert die Größe des Bildschirm, der kleinste Viewport hat also die kleinste Zahl.
		 * 
		 * @type {{xss: number, xs: number, sm: number, md number, lg: number}}
		 */
		var viewportOrderList = {
			'xxs' : 0,
			'xs': 1, 
			'sm': 2, 
			'md' : 3,
			'lg' : 4,
			'xl' : 5
		};
		
		return {
			/**
			 * Getter Methode zum Zugriff auf die privaten Viewport-Größen.
			 *
			 * @param value String Identifiert des Viewports (z.b. xs)
			 * @returns number
			 */
			getComparableValue: function(value) {
				return viewportOrderList[value];
			}
		};
	})();

	
	/**
	 * Aktueller Viewport des Users
	 * 
	 * Der Viewport wird inital auf "" gestellt und mithilfe von refreshViewport aktualisiert.
	 * @type {string}
	 */
	var windowViewport = "";

	/**
	 * Aktualisiert den Viewport
	 * 
	 * Der Viewport wird aus dem body:before Tag ausgelesen. Die Logik für den eigentlichen
	 * Viewport kommt daher direkt aus dem Less, es ist keien Abfrage der Bildschirmgröße nötig.
	 * 
	 */
	var refreshViewport = function () {
		if (!document.body) {
			// Mobile first
			return sizes.getComparableValue('xxs');
		}
		var computedStyle = window.getComputedStyle(document.body, ':before');
		windowViewport = computedStyle.getPropertyValue('content').replace(/\"/g, '');
	};
	
	/**
	 * Funktion zum Überprüfen, ob sich der Viewport geändert hat.
	 * @returns {boolean}
	 */
	var hasChanged = function () {
		var lastViewport = windowViewport;
		refreshViewport();
		return lastViewport !== windowViewport;
	};
	
	// Viewport initalisieren
	refreshViewport();
	
	return {
		/**
		 * true, falls sich der Viewport seit dem letzten Test geändert hat
		 * 
		 * @returns {boolean}
		 */
		hasChanged : function () {
			return hasChanged();
		},
		
		/**
		 * Überprüft, ob der Viewport des Users genau 'xxs' (Smartphone) entspricht
		 * 
		 * @returns {boolean} wahr, falls der Viewport xxs ist
		 */
		isXxs : function () { 
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('xxs');
		}, 

		/**
		 * Überprüft, ob der Viewport des Users genau 'xs' (Smartphone) entspricht
		 * 
		 * @returns {boolean} wahr, falls der Viewport xs ist
		 */
		isXs : function () { 
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('xs');
		}, 
		
		/**
		 * Überprüft, ob der Viewport des Users genau 'sm' (Tablet) entspricht
		 * 
		 * @returns {boolean} wahr, falls der Viewport sm ist
		 */
		isSm : function () { 
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('sm');
		},

		/**
		 * Überprüft, ob der Viewport des Users genau 'md' (Desktop) entspricht
		 * 
		 * @returns {boolean} wahr, falls der Viewport md ist
		 */
		isMd : function () { 
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('md');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users genau 'lg' (Large Desktop) entspricht
		 * 
		 * @returns {boolean} wahr, falls der Viewport lg ist
		 */
		isLg : function () { 
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('lg');
		},

		/**
		 * Überprüft, ob der Viewport des Users genau 'xl' (UHD Desktop) entspricht
		 *
		 * @returns {boolean} wahr, falls der Viewport xl ist
		 */
		isXl : function () {
			return sizes.getComparableValue(windowViewport) === sizes.getComparableValue('xl');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users 'xs' (Smartphone) oder einem größen Viewport entspricht
		 * 
		 * @returns {boolean} wahr, falls der mindestens Viewport sm entspricht
		 */ 
		isXsUp : function () { 
			return sizes.getComparableValue(windowViewport) >= sizes.getComparableValue('xs');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users 'sm' (Tablet) oder einem größen Viewport entspricht
		 * 
		 * @returns {boolean} wahr, falls der mindestens Viewport sm entspricht
		 */
		isSmUp : function () { 
			return sizes.getComparableValue(windowViewport) >= sizes.getComparableValue('sm');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users 'md' (Desktop small) oder einem größen Viewport entspricht
		 * 
		 * @returns {boolean} wahr, falls der mindestens Viewport md entspricht
		 */
		isMdUp : function () { 
			return sizes.getComparableValue(windowViewport) >= sizes.getComparableValue('md');
		},

		/**
		 * Überprüft, ob der Viewport des Users 'lg' (Desktop large) oder einem größen Viewport entspricht
		 *
		 * @returns {boolean} wahr, falls der mindestens Viewport lg entspricht
		 */
		isLgUp : function () {
			return sizes.getComparableValue(windowViewport) >= sizes.getComparableValue('lg');
		},

		/**
		 * Überprüft, ob der Viewport des Users 'xs' (Smartphone) entpsricht
		 * 
		 * @returns {boolean} wahr, falls der maximal Viewport xs entspricht
		 */
		isXsDown : function () { 
			return sizes.getComparableValue(windowViewport) <= sizes.getComparableValue('xs');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users 'sm' (Tablet) oder einem kleineren Viewport entspricht
		 * 
		 * @returns {boolean} wahr, falls der maximal Viewport sm entspricht
		 */
		isSmDown : function () { 
			return sizes.getComparableValue(windowViewport) <= sizes.getComparableValue('sm');
		},
		
		/**
		 * Überprüft, ob der Viewport des Users 'md' (Desktop) oder einem kleineren Viewport entspricht
		 * 
		 * @returns {boolean} wahr, falls der maximal Viewport md entspricht
		 */
		isMdDown : function () {
			return sizes.getComparableValue(windowViewport) <= sizes.getComparableValue('md');
		},

		/**
		 * Überprüft, ob der Viewport des Users 'lg' (Desktop large) oder einem kleineren Viewport entspricht
		 *
		 * @returns {boolean} wahr, falls der maximal Viewport lg entspricht
		 */
		isLgDown : function () {
			return sizes.getComparableValue(windowViewport) <= sizes.getComparableValue('lg');
		},

		/**
		 * Gibt den Viewport zurück.
		 * 
		 * @notice Bitte nur dann nutzen, wenn alle anderen Methoden nicht ausreichen!
		 * @returns {string} Identifier des aktuellen Viewports
		 */
		get : function () {
			return windowViewport;
		}
	};
}());



/**
 * Resize Event abfangen, um ggf. eigenes Event zum Anpassen des Viewports zu senden.
 * 
 * gw_viewportChanged wird gesendet, sobald sich der Viewport geändert hat. Somit kann an andere Stelle auf 
 * dieses Event gehört werden, um ein einheitliches Handling von Änderungen am Viewport zu ändern
 * 
 * Beispiel:
 * $(window).on('gw_viewportChanged', function () {
 *	 if(Gw.Viewport.isSm()) {
 *  	console.log("Viewport = SM");
 *   } else if(Gw.Viewport.minSm()) {
 *      console.log("Viewport >= SM");
 *   }
 * });
 *
 */
jQuery(window).on('resize orientationchange', function () {
	if (Gw.Viewport.hasChanged()) {
		jQuery(window).trigger('gw_viewportChanged');
	}
});

// Event nach dem Laden der Seite abfeuern, allerdings erst nachdem alle .ready(...) Events abgearbeitet wurden
jQuery(function() {
	window.setTimeout(function () {
		jQuery(window).triggerHandler('gw_viewportChanged');
	}, 100);
});
