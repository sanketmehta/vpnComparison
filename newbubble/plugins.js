/*eslint-disable*/
(function() {
	// jscs:disable

	/**
	 * Avoid `console` errors in browsers that lack a console.
	 * console polyfill
	 */
	var method;
	var noop = function() {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	/**
	 * Function.prototype.bind polyfill
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			/*eslint one-var:0, indent:0, new-cap:0*/
			var aArgs       = Array.prototype.slice.call(arguments, 1),
					fToBind = this,
					fNOP    = function() {},
					fBound  = function() {
						return fToBind.apply(this instanceof fNOP
									? this
									: oThis,
									aArgs.concat(Array.prototype.slice.call(arguments)));
					};

			if (this.prototype) {
				// native functions don't have a prototype
				fNOP.prototype = this.prototype;
			}
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
	// jscs:enable

// Place other polyfill here


}());

// Place any jQuery/helper plugins in here.


