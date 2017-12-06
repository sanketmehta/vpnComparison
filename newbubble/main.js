/* © 2015 NauStud.io
 * @author ...
 */

var nau = nau || {};

(function() {
	'use strict';
	var heroBanner = nau.HeroBanner;
	var navBarToggle = nau.NavBarToggleWithBackground;
	var getInTouch = nau.GetInTouchAnimation;
	// var vanilla = window.Vanilla;
	// var oldScroll = 50;
	// var api = this.gapi;

	nau.ready(function() {
		// console.log('Document ready');
		if ($('.loading')) {
			setTimeout(function() {
				Vanilla.addClass($('.loading'), 'closed');
			}, 1000);
			setTimeout(function() {
				$('.loading').style.display = 'none';
				$('body').style.overflow = 'auto';
				$('body').style.height = 'auto';
			}, 1000);

		}

		heroBanner.init();

		if ($('.get-in-touch')) {
			getInTouch.run();
		}

		// Toggle Play/Pause all video
		if ($('.js-btn-play-pause')) {
			var btnPlayPause = $('.js-btn-play-pause');
			var btnPlayIcon = $('.btn-play-icon');
			btnPlayPause.addEventListener('click', function(event) {
				var videoWrapper = Vanilla.getClosest(event.target, '.video-wrapper');
				var video = videoWrapper.getElementsByTagName('video')[0];

				if (video.ended || video.paused) {
					video.play();
					btnPlayIcon.style.opacity = '0';
				} else {
					video.pause();
					btnPlayIcon.style.opacity = '1';
				}

				Vanilla.toggleClass(btnPlayPause, 'status-paused');

			});

			$$('.video-wrapper').forEach(function(videoWrapper) {
				var video = videoWrapper.getElementsByTagName('video')[0];

				video.addEventListener('ended', function() {
					Vanilla.removeClass(btnPlayPause, 'status-paused');
					video.currentTime = 0;
				});
			});
		}

		//Init NavBarToggleWithBackground
		navBarToggle.init('.js-nav-bar-toggle-with-background');

		//Toggle dropdown
		$$('.js-dropdown').forEach(function(element) {
			element.querySelector('.dropdown__toggle').addEventListener('click', function() {
				Vanilla.toggleClass(element.querySelector('.dropdown__menu'), 'open');
			});

			var nodesArray = Array.prototype.slice.call(element.querySelectorAll('.dropdown__menu li'));
			nodesArray.forEach(function(e) {
				e.addEventListener('click', function() {
					Vanilla.toggleClass(element.querySelector('.dropdown__menu'), 'open');
				});
			});
		});



		//Toggle Nav bar on mobile
		$$('.js-nav-bar-toggle').forEach(function(element) {
			element.addEventListener('click', function() {
				Vanilla.toggleClass(element.parentElement.querySelector('.header-global__nav-bar'), 'open');
				Vanilla.toggleClass(element, 'open');
				Vanilla.toggleClass(element.querySelector('.nav-bar-toggle__background'), 'hide');
			});
		});

		//show background on blog clicked
		if (window.innerWidth < 768) {
			$$('.js-blog').forEach(function(element) {
				element.addEventListener('click', function() {
					$$('.js-blog').forEach(function(el) {
						Vanilla.removeClass(el, 'blog--tap');
					});

					Vanilla.addClass(element, 'blog--tap');
				});
			});
		}

		//Navigation animate
		$('.js-nav-bar-toggle--desktop').addEventListener('click', function() {
			// console.log('nav bar clicked');
			expand();
		});

		// $$('.js-project').forEach(function(element) {
		// 	element.addEventListener('mouseenter', function(event) {
		// 		event.target.querySelector('.project__image').style.display = 'block';
		// 		setTimeout(function() {
		// 			Vanilla.addClass(event.target.querySelector('.project__image'), 'active');
		// 		}, 10);
		// 	});

		// 	element.addEventListener('mouseleave', function(event) {
		// 		event.target.querySelector('.project__image').style.display = 'none';
		// 		Vanilla.removeClass(event.target.querySelector('.project__image'), 'active');
		// 	});

		// });
		if ($('.js-send-email-contact') !== null) {
			$('.js-send-email-contact').addEventListener('click', function() {
				var data = {
					name: $('#name').value || 'None',
					email: $('#email-1').value || 'None',
					company: $('#company_organization').value || 'None',
					detail: $('#area-content').value || 'None'
				};
				// console.log(data);
				var request = new XMLHttpRequest();
				request.open('GET', 'https://script.google.com/macros/s/AKfycbzKtmOsuWei3NaCRzUxvgDXKo69ucaHk0-OsJVo5HEbccU5PIaS/exec?' + 'name=' + data.name + '&email=' + data.email + '&company=' + data.company + '&detail=' + data.detail, true);

				request.onload = function() {
					if (request.status >= 200 && request.status < 400) {
						alert('success');
					} else {
						alert('error');
					}
				};

				request.onerror = function() {
				};

				request.send();
				// console.log('sended');
			});
		}

		//Scroll on click or tap
		$$('.js-scroll').forEach(function(element) {
			element.addEventListener('click', function() {
				var scrollHeight = $('.header-global__hero-banner').clientHeight;
				if (window.innerWidth >= 992) {
					scrollHeight = window.innerHeight - 73;
				}
				pageScroll(scrollHeight);
			});
		});

		// // console.log('There are', $$('section').length, 'sections');
		// $('.js-header-global__scroll').addEventListener('click', function(e) {
		// 	e.preventDefault();
		// 	pageScroll();
		// });
	});

	var scrolldelay;
	function pageScroll(scrollHeight) {
		window.scrollBy(0, 1);
		if (Math.max($('html body').scrollTop, $('html').scrollTop) < scrollHeight) {
			scrolldelay = setTimeout(function() {
				pageScroll(scrollHeight);
			}, 5);
		} else {
			clearTimeout(scrolldelay);
		}

	}

	window.onresize = function() {
		if (window.innerWidth >= 992 && $('.header-global--no-hero-banner') !== null) {
			heroBanner.heightCaculate();
			heroBanner.videoResize();
		}
	};

	// var oldScroll = 0;
	window.addEventListener('scroll', function() {
		var scrollTop = Math.max($('html body').scrollTop, $('html').scrollTop);
		var banner = $('.header-global__hero-banner');
		var footer = $('.js-footer__let-have-coffee');
		// console.log(scrollTop);

		if (window.innerWidth >= 992 && !$('.no-animation') && !$('.post-fixed')) {
			// fix menu on top
			if (parseFloat($('.js-header-global').style.top) < -94 ) {
				Vanilla.addClass($('.js-nav-bar-desktop'), 'fixed');
				Vanilla.addClass($('.js-nav-bar-desktop'), 'ready');
			} else {
				Vanilla.removeClass($('.js-nav-bar-desktop'), 'fixed');
				Vanilla.removeClass($('.js-nav-bar-desktop'), 'ready');
				expand();
			}
		}

		// hide nav-bar when scroll into footer
		if ($('.no-animation') && !$('.post-fixed')) {
			if (window.innerWidth >= 992 && banner) {
				// fix menu on top
				if (scrollTop > banner.clientHeight ) {
					Vanilla.addClass($('.js-nav-bar-desktop'), 'fixed');
					Vanilla.addClass($('.js-nav-bar-desktop'), 'ready');
				} else {
					Vanilla.removeClass($('.js-nav-bar-desktop'), 'fixed');
					Vanilla.removeClass($('.js-nav-bar-desktop'), 'ready');
					expand();
				}
			}
			if ( (scrollTop + 100) >= footer.offsetTop ) {
				$('.js-nav-bar-desktop').style.display = 'none';
			} else {
				$('.js-nav-bar-desktop').style.display = 'flex';
			}

			if ($('.footer__let-have-coffee') !== null) {
				Vanilla.addClass($('.footer__let-have-coffee'), 'footer-no-animation');
			}

		}

		//post menu fixed
		var mq = window.matchMedia('(min-width: 992px)');

		if ($('.post-fixed') && (mq.matches)) {
			$('.post-fixed').style.paddingTop = '7rem';
			Vanilla.addClass($('.js-nav-bar-desktop'), 'fixed');
			if (scrollTop > 35 ) {
				Vanilla.addClass($('.js-nav-bar-desktop'), 'ready');
			} else {
				Vanilla.removeClass($('.js-nav-bar-desktop'), 'ready');
				expand();
			}
		}

		if (window.innerWidth >= 992 && (Vanilla.hasClass($('.js-nav-bar-desktop'), 'ready'))) {
			// if (scrollTop > oldScroll) {

			$$('.js-header-global__nav-bar-left li').forEach(function($element, index) {
				$element.style.transitionDelay = (8 - index) * 0.01 + 's';
			});

			$('.js-nav-bar-toggle--desktop').style.transitionDelay = '0.3s';
			Vanilla.addClass($('.js-nav-bar-desktop'), 'collapse');

			Vanilla.addClass($('.js-header-global__nav-bar-left'), 'header-global__nav-bar-left--no-mouse-event');
			Vanilla.addClass($('.js-header-global__nav-bar-right'), 'header-global__nav-bar-right--no-mouse-event');
			// }
			// else {
			// 	expand();
			// }
			// oldScroll = scrollTop;
		}

	});

	function expand() {
		Vanilla.removeClass($('.js-header-global__nav-bar-left'), 'header-global__nav-bar-left--no-mouse-event');
		Vanilla.removeClass($('.js-header-global__nav-bar-right'), 'header-global__nav-bar-right--no-mouse-event');
		setTimeout(function() {
			$$('.js-header-global__nav-bar-left li').forEach(function($element, index) {
				$element.style.transitionDelay = 0.2 + index * 0.01 + 's';
			});

			$('.js-nav-bar-toggle--desktop').style.transitionDelay = '0s';
			Vanilla.removeClass($('.js-nav-bar-desktop'), 'collapse');
		}, 1);
	}

	$$('.filter__choice a').forEach(function(element) {
		element.addEventListener('click', function(e) {
			var filterText = e.currentTarget.innerText;
			$$('.filter__choice a').forEach(function(choice) {
				Vanilla.removeClass(choice, 'active');
			});
			Vanilla.addClass(e.currentTarget, 'active');
			$$('.js-project').forEach(function(ele) {
				Vanilla.removeClass(ele.parentElement, 'hide');
			});
			if (filterText !== 'All') {
				$$('.js-project').forEach(function(ele) {
					var projectWork = ele.querySelector('.project__work').innerText;
					var categories = projectWork.split(' \n');
					if (categories.indexOf(filterText) === -1) {
						Vanilla.addClass(ele.parentElement, 'hide');
					}
				});
			}
		});
	});

}());
