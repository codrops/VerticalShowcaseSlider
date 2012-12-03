var Slider = (function() {
	
	var $container = $( '#ps-container' ),
		$contentwrapper = $container.children( 'div.ps-contentwrapper' ),
		// the items (description elements for the slides/products)
		$items = $contentwrapper.children( 'div.ps-content' ),
		itemsCount = $items.length,
		$slidewrapper = $container.children( 'div.ps-slidewrapper' ),
		// the slides (product images)
		$slidescontainer = $slidewrapper.find( 'div.ps-slides' ),
		$slides = $slidescontainer.children( 'div' ),
		// navigation arrows
		$navprev = $slidewrapper.find( 'nav > a.ps-prev' ),
		$navnext = $slidewrapper.find( 'nav > a.ps-next' ),
		// current index for items and slides
		current = 0,
		// checks if the transition is in progress
		isAnimating = false,
		// support for CSS transitions
		support = Modernizr.csstransitions,
		// transition end event
		// https://github.com/twitter/bootstrap/issues/2870
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		// its name
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],

		init = function() {

			// show first item
			var $currentItem = $items.eq( current ),
				$currentSlide = $slides.eq( current ),
				initCSS = {
					top : 0,
					zIndex : 999
				};

			$currentItem.css( initCSS );
			$currentSlide.css( initCSS );
			
			// update nav images
			updateNavImages();

			// initialize some events
			initEvents();

		},
		updateNavImages = function() {

			// updates the background image for the navigation arrows
			var configPrev = ( current > 0 ) ? $slides.eq( current - 1 ).css( 'background-image' ) : $slides.eq( itemsCount - 1 ).css( 'background-image' ),
				configNext = ( current < itemsCount - 1 ) ? $slides.eq( current + 1 ).css( 'background-image' ) : $slides.eq( 0 ).css( 'background-image' );

			$navprev.css( 'background-image', configPrev );
			$navnext.css( 'background-image', configNext );

		},
		initEvents = function() {

			$navprev.on( 'click', function( event ) {

				if( !isAnimating ) {
					
					slide( 'prev' );
				
				}
				return false;

			} );

			$navnext.on( 'click', function( event ) {

				if( !isAnimating ) {
					
					slide( 'next' );
				
				}
				return false;

			} );

			// transition end event
			$items.on( transEndEventName, removeTransition );
			$slides.on( transEndEventName, removeTransition );
			
		},
		removeTransition = function() {

			isAnimating = false;
			$(this).removeClass('ps-move');

		},
		slide = function( dir ) {

			isAnimating = true;

			var $currentItem = $items.eq( current ),
				$currentSlide = $slides.eq( current );

			// update current value
			if( dir === 'next' ) {

				( current < itemsCount - 1 ) ? ++current : current = 0;

			}
			else if( dir === 'prev' ) {

				( current > 0 ) ? --current : current = itemsCount - 1;

			}
				// new item that will be shown
			var $newItem = $items.eq( current ),
				// new slide that will be shown
				$newSlide = $slides.eq( current );

			// position the new item up or down the viewport depending on the direction
			$newItem.css( {
				top : ( dir === 'next' ) ? '-100%' : '100%',
				zIndex : 999
			} );
			
			$newSlide.css( {
				top : ( dir === 'next' ) ? '100%' : '-100%',
				zIndex : 999
			} );

			setTimeout( function() {

				// move the current item and slide to the top or bottom depending on the direction 
				$currentItem.addClass( 'ps-move' ).css( {
					top : ( dir === 'next' ) ? '100%' : '-100%',
					zIndex : 1
				} );

				$currentSlide.addClass( 'ps-move' ).css( {
					top : ( dir === 'next' ) ? '-100%' : '100%',
					zIndex : 1
				} );

				// move the new ones to the main viewport
				$newItem.addClass( 'ps-move' ).css( 'top', 0 );
				$newSlide.addClass( 'ps-move' ).css( 'top', 0 );

				// if no CSS transitions set the isAnimating flag to false
				if( !support ) {

					isAnimating = false;

				}

			}, 0 );

			// update nav images
			updateNavImages();

		};

	return { init : init };

})();