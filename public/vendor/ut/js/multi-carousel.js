/**
 * Erweiterung des Bootstrap-Carousels
 * um Fähigkeiten zur Ansteuerung mehrerer Folien/Carousel Items
 *
 * @summary     Multi-Carousel
 * author       Galileo Webagentur oHG
 * @requires    viewport.js, jquery.js, carousel.js (Bootstrap)
 *
 */

+function ($) {
	'use strict';

	var MultiCarousel = function (element, options) {
		this.$element = $(element);
		this.$indicators = $();
		this.$multiindicators = this.$element.find('.carousel-indicators');
		this.options = options;
		this.paused = null;
		this.sliding = null;
		this.interval = null;
		this.$active = null;
		this.$items = null;

		this.$element.attr('data-slides', options.slides);
		this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));
		
		this.options.pause === 'hover' && !('ontouchstart' in document.documentElement) && this.$element
			.on('mouseenter.bs.carousel', $.proxy(this.pause, this))
			.on('mouseleave.bs.carousel', $.proxy(this.cycle, this));

		// Controls nur aktivieren, falls notwendig
		if ($('.ut-multi-carousel__item',  this.$element).length <= this.options.slides) {
			$('.ut-multi-carousel__control-bar', this.$element).addClass('ut-multi-carousel__control-bar--is-disabled')
		}
		
		var index = 0;
		$('.ut-multi-carousel__item', this.$element).each(function() { 
			$(this).data('index', index++); 
		});
	};

	if (!$.fn.carousel) {
		throw new Error('MultiCarousel requires carousel.js');
	}

	MultiCarousel.DEFAULTS = $.extend({}, $.fn.carousel.Constructor.DEFAULTS, {
		slides : 3
	});

	MultiCarousel.prototype = $.extend({}, $.fn.carousel.Constructor.prototype);

	MultiCarousel.prototype.constructor = MultiCarousel;
	
	// Alte slide Funktion sichern um sie in der überschriebenen aufrufen zu können
	var carouselSlide = MultiCarousel.prototype.slide;
	
	/**
	 * Überschreibt die Slide Funktion vom Bootstrap Carousel
	 * 
	 * @param type
	 * @param next
	 */
	MultiCarousel.prototype.slide = function (type, next) {
		var $this = this.$element;
		// Elemente vorne/hinten Anhängen, wenn wir am Anfang/Ende angekommen sind (wrap)
		var $slides = $('.ut-multi-carousel__item', $this);
		var $active = $('.ut-multi-carousel__item.active', $this);
		var index = $slides.index($active);
		// Hinten Anhängen?
		if (type === 'next' && $slides.eq(index + this.options.slides).length === 0) {
			var $slide = $slides.first();
			$slide.parent().append($slide);
		// Vorne Anhängen?
		} else if (type !== 'next' && index === 0) {
			var $slide = $('.ut-multi-carousel__item', $this).last();
			$slide.parent().prepend($slide);
		}
		
		// Elternmethode aufrufen
		carouselSlide.call(this, type, next);
		
		// Indikatoren aktualisieren
		if (this.$multiindicators.length) {
			this.$multiindicators.find('.active').removeClass('active');
			var $nextIndicator = $(this.$multiindicators.children()[$('.ut-multi-carousel__item.next,.ut-multi-carousel__item.prev', $this).data('index')]);
			$nextIndicator && $nextIndicator.addClass('active')
		}
	};

	/**
	 * jQuery Plugin Funktion für Aufrufe von $(*).multicarousel(...)
	 * 
	 * @param option
	 * @returns {*}
	 * @constructor
	 */
	function Plugin(option) {
		return this.each(function () {
			var $this = $(this), data = $this.data('bs.carousel'),
				options = $.extend({}, MultiCarousel.DEFAULTS, $this.data(), typeof option === 'object' && option),
				action = typeof option === 'string' ? option : options.slide;

			if (!data) {
				$this.data('bs.carousel', (data = new MultiCarousel(this, options)));
			}
			if (typeof option === 'number') {
				data.to(option);
			}
			else if (action) {
				data[action]();
			}
			else if (options.interval) {
				data.pause().cycle();
			}
		});
	}
	
	var old = $.fn.multicarousel;

	$.fn.multicarousel = Plugin;
	$.fn.multicarousel.Constructor = MultiCarousel;

	// NO CONFLICT
	$.fn.multicarousel.noConflict = function () {
		$.fn.multicarousel = old;
		return this
	};

	$(window).on('load', function () {
		$('[data-ride="multi-carousel"]').each(function () {
			var $carousel = $(this);
			Plugin.call($carousel, $carousel.data());
		}).on('slide.bs.carousel', function () {
			
		});
	});
}(jQuery);