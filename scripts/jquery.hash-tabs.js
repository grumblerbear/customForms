(function( $ ){

	var methods;
	methods = {
		init: function (options) {
			//noinspection JSValidateTypes
			options = $.extend({
				selectorTriggers: '.trigger',
				selectorTabs: '.tab',
				hashPostfix: '_box',
				clickCallback: function (targetTab) {},
				openCallback: function (targetTab) {}
			}, options);

			return this.each(function () {
				var self = $(this);
				var elements;
				elements = {
					self: self,
					triggers: self.find(options.selectorTriggers),
					tabs: self.find(options.selectorTabs)
				};

				elements.triggers.each(function(){
					var href = $(this).attr('href');
					var index = $(this).index();
					if ( !href || href == '#' ) {
						$(this).attr('href', '#hash_tab' + index + options.hashPostfix);
						$(elements.tabs.get(index)).attr('id', 'hash_tab' + index);
					}
				});

				elements.tabs.each(function(){
					var id = $(this).attr('id');
					var index = $(this).index();
					if ( !id ) {
						var href = $(elements.triggers.get(index)).attr('href');
						href = href.replace("#", "");
						href = href.replace(options.hashPostfix, "");

						$(this).attr('id', href);
					}
				});

				if (window.location.hash) {
					var hash = window.location.hash;
					var href = "[href='" + hash + "']";
					if (elements.triggers.filter(href).length > 0) {
						elements.triggers.filter(href).hashTabs('switch', elements, options);
					} else {
						elements.triggers.first().hashTabs('switch', elements, options);
					}
				} else {
					elements.triggers.first().hashTabs('switch', elements, options);
				}

				elements.triggers.on('click', function () {
					var index = $(this).index();
					options.clickCallback.call(this, elements.tabs.get(index));
					$(this).hashTabs('switch', elements, options);
				});
			});
		},
		switch: function (elements, options) {
			return this.each(function () {
				var hash = $(this).attr('href');
				var href = "[href='" + hash + "']";
				if (hash) {
					elements.triggers.removeClass("active");
					elements.tabs.removeClass("active");

					elements.triggers.filter(href).addClass("active");
					hash = hash.replace(options.hashPostfix, "");

					elements.tabs.filter(hash).addClass("active");

					options.openCallback.call(this, elements.tabs.filter(hash));
				}
			});
		}
	};

	$.fn.hashTabs = function ( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Метод ' +  method + ' в jQuery.hashTabs не существует' );
			return false;
		}
	};
})( jQuery );