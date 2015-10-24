(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PartsBin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _classesOutputsOutput = require('classes/outputs/Output');

var _classesOutputsOutput2 = _interopRequireDefault(_classesOutputsOutput);

var Bin = (function () {
	function Bin() {
		var _this = this;

		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Bin);

		this.sources = options.sources || [];
		this.output = options.output || new _classesOutputsOutput2['default']();
		this.sources.forEach(function (source) {
			return _this.registerSource(source, false);
		});
	}

	_createClass(Bin, [{
		key: 'registerSource',
		value: function registerSource(source) {
			var _this2 = this;

			var push = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			if (push) {
				this.sources.push(source);
			}
			source.on('change', function () {
				return _this2.handleSourceChange(source);
			});
		}
	}, {
		key: 'unregisterSource',
		value: function unregisterSource(source) {
			var reset = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			for (var i = 0; i < this.sources.length; i++) {
				if (this.sources[i] === source) {
					this.sources.splice(i, 1);
					// TODO: Remove 'change' listener from source
					// Only remove the first instance of this source
					break;
				}
			}
			if (reset) {
				this.resetOutput();
			}
		}
	}, {
		key: 'addAllSources',
		value: function addAllSources() {
			var _this3 = this;

			return new Promise(function (accept, reject) {
				var chain = Promise.resolve();
				_this3.sources.forEach(function (source) {
					chain = chain.then(function () {
						return _this3.addSource(source);
					})['catch'](reject);
				});
				chain.then(accept);
			});
		}
	}, {
		key: 'addSource',
		value: function addSource(source) {
			return Promise.resolve(source.addTo(this));
		}
	}, {
		key: 'handleSourceChange',
		value: function handleSourceChange(source) {
			var requiresSetup = source.injector.teardown(this);
			if (requiresSetup) {
				this.addSource(source);
			}
		}
	}, {
		key: 'resetOutput',
		value: function resetOutput() {
			var _this4 = this;

			this.output.reset();
			return this.output.ready(function () {
				return _this4.addAllSources();
			});
		}
	}]);

	return Bin;
})();

exports['default'] = Bin;
module.exports = exports['default'];

},{"classes/outputs/Output":13}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EVENTS = Symbol('events');

var Emitter = (function () {
	function Emitter() {
		_classCallCheck(this, Emitter);

		this[EVENTS] = {};
	}

	_createClass(Emitter, [{
		key: 'on',
		value: function on(events, listener) {
			var _this = this;

			events.split(/,?\s+/g).forEach(function (event) {
				_this[EVENTS][event] = _this[EVENTS][event] || [];
				_this[EVENTS][event].push(listener);
			});
			return this;
		}
	}, {
		key: 'once',
		value: function once(event, listener) {
			var _this2 = this;

			var callback = function callback() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				_this2.off(event, callback);
				Reflect.apply(listener, _this2, args);
			};
			callback.listener = listener;
			this.on(event, callback);
			return this;
		}
	}, {
		key: 'off',
		value: function off(event, listener) {
			var listeners = this[EVENTS][event];
			if (!listeners) {
				return this;
			}
			if (!listener) {
				this.removeAllListeners(event);
				return this;
			}
			for (var i = 0; i < listeners.length; i++) {
				var current = listeners[i];
				if (current === listener || current.listener === listener) {
					listeners.splice(i, 1);
					i--;
				}
			}
			if (listeners.length <= 0) {
				this.removeAllListeners(event);
			}
			return this;
		}
	}, {
		key: 'removeAllListeners',
		value: function removeAllListeners(event) {
			if (event) {
				Reflect.deleteProperty(this[EVENTS], event);
			} else {
				this[EVENTS] = {};
			}
			return this;
		}
	}, {
		key: 'emit',
		value: function emit(event) {
			var _this3 = this;

			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			var listeners = this[EVENTS][event];
			if (!listeners) {
				return this;
			}
			listeners.forEach(function (listener) {
				return Reflect.apply(listener, _this3, args);
			});
			return this;
		}
	}]);

	return Emitter;
})();

exports['default'] = Emitter;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesEmitter = require('classes/Emitter');

var _classesEmitter2 = _interopRequireDefault(_classesEmitter);

var INTERVAL = Symbol('interval');
var MODIFIED = Symbol('lastModified');

var FileWatcher = (function (_Emitter) {
	_inherits(FileWatcher, _Emitter);

	function FileWatcher(file) {
		var interval = arguments.length <= 1 || arguments[1] === undefined ? FileWatcher.DEFAULT_INTERVAL : arguments[1];

		_classCallCheck(this, FileWatcher);

		_get(Object.getPrototypeOf(FileWatcher.prototype), 'constructor', this).call(this);
		if (!(file instanceof File)) {
			throw new Error('FileWatcher must be initialized with a file to watch');
		}
		this.interval = interval;
		this.file = file;
		this[MODIFIED] = file.lastModified;
	}

	_createClass(FileWatcher, [{
		key: 'loop',
		value: function loop() {
			if (this.file.lastModified !== this[MODIFIED] && this.file.size > 0) {
				this.didChange();
				this[MODIFIED] = this.file.lastModified;
			}
		}
	}, {
		key: 'didChange',
		value: function didChange() {
			this.emit('change', this.file);
		}
	}, {
		key: 'watching',
		set: function set(value) {
			var _this = this;

			if (value || this[INTERVAL]) {
				clearInterval(this[INTERVAL]);
			}
			if (value) {
				this[INTERVAL] = setInterval(function () {
					return _this.loop();
				}, this.interval);
			}
		}
	}]);

	return FileWatcher;
})(_classesEmitter2['default']);

FileWatcher.DEFAULT_INTERVAL = 100;

exports['default'] = FileWatcher;
module.exports = exports['default'];

},{"classes/Emitter":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseError = (function (_Error) {
	_inherits(BaseError, _Error);

	function BaseError(message) {
		_classCallCheck(this, BaseError);

		_get(Object.getPrototypeOf(BaseError.prototype), "constructor", this).call(this);
		this.message = message;
	}

	_createClass(BaseError, [{
		key: "name",
		get: function get() {
			return this.constructor.name;
		}
	}]);

	return BaseError;
})(Error);

exports["default"] = BaseError;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesErrorsError = require('classes/errors/Error');

var _classesErrorsError2 = _interopRequireDefault(_classesErrorsError);

var NotImplementedError = (function (_Error) {
  _inherits(NotImplementedError, _Error);

  function NotImplementedError() {
    _classCallCheck(this, NotImplementedError);

    _get(Object.getPrototypeOf(NotImplementedError.prototype), 'constructor', this).apply(this, arguments);
  }

  return NotImplementedError;
})(_classesErrorsError2['default']);

exports['default'] = NotImplementedError;
module.exports = exports['default'];

},{"classes/errors/Error":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var CSSInjector = (function (_Injector) {
	_inherits(CSSInjector, _Injector);

	function CSSInjector() {
		_classCallCheck(this, CSSInjector);

		_get(Object.getPrototypeOf(CSSInjector.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(CSSInjector, [{
		key: 'setup',
		value: function setup(bin, input) {
			var style = document.createElement('style');
			style.innerHTML = input;
			bin.output.head.appendChild(style);
		}

		// TODO: Add teardown method
	}]);

	return CSSInjector;
})(_classesInjectorsInjector2['default']);

exports['default'] = CSSInjector;
module.exports = exports['default'];

},{"classes/injectors/Injector":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var HTMLInjector = (function (_Injector) {
	_inherits(HTMLInjector, _Injector);

	function HTMLInjector() {
		_classCallCheck(this, HTMLInjector);

		_get(Object.getPrototypeOf(HTMLInjector.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(HTMLInjector, [{
		key: 'setup',
		value: function setup(bin, input) {
			// Create temporary parent container
			var temp = document.createElement('div');
			temp.innerHTML = input;
			var children = temp.childNodes;
			var frag = document.createDocumentFragment();
			while (children.length) {
				frag.appendChild(children[0]);
			}
			bin.output.body.appendChild(frag);
		}
	}]);

	return HTMLInjector;
})(_classesInjectorsInjector2['default']);

exports['default'] = HTMLInjector;
module.exports = exports['default'];

},{"classes/injectors/Injector":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _classesErrorsNotImplementedError = require('classes/errors/NotImplementedError');

var _classesErrorsNotImplementedError2 = _interopRequireDefault(_classesErrorsNotImplementedError);

var Injector = (function () {
	function Injector() {
		_classCallCheck(this, Injector);
	}

	_createClass(Injector, [{
		key: 'setup',
		value: function setup() {
			throw new _classesErrorsNotImplementedError2['default']('Injection must be implemented by subclass');
		}
	}, {
		key: 'teardown',
		value: function teardown(bin) {
			// Default behaviour is to reset the bin
			bin.resetOutput();
			// Return `true` if the setup needs to be explicitly called again
			return false;
		}
	}]);

	return Injector;
})();

exports['default'] = Injector;
module.exports = exports['default'];

},{"classes/errors/NotImplementedError":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var JSInjector = (function (_Injector) {
	_inherits(JSInjector, _Injector);

	function JSInjector() {
		_classCallCheck(this, JSInjector);

		_get(Object.getPrototypeOf(JSInjector.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(JSInjector, [{
		key: 'setup',
		value: function setup(bin, input) {
			var script = document.createElement('script');
			script.innerHTML = input;
			bin.output.head.appendChild(script);
		}
	}]);

	return JSInjector;
})(_classesInjectorsInjector2['default']);

exports['default'] = JSInjector;
module.exports = exports['default'];

},{"classes/injectors/Injector":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var ScriptInjector = (function (_Injector) {
	_inherits(ScriptInjector, _Injector);

	function ScriptInjector() {
		_classCallCheck(this, ScriptInjector);

		_get(Object.getPrototypeOf(ScriptInjector.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ScriptInjector, [{
		key: 'setup',
		value: function setup(bin, input) {
			return new Promise(function (accept, reject) {
				var script = document.createElement('script');
				script.src = input;
				script.addEventListener('load', function () {
					return accept(script);
				});
				script.addEventListener('error', function () {
					return reject(new Error('Could not load script'));
				});
				bin.output.head.appendChild(script);
			});
		}
	}]);

	return ScriptInjector;
})(_classesInjectorsInjector2['default']);

exports['default'] = ScriptInjector;
module.exports = exports['default'];

},{"classes/injectors/Injector":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var StyleInjector = (function (_Injector) {
	_inherits(StyleInjector, _Injector);

	function StyleInjector() {
		_classCallCheck(this, StyleInjector);

		_get(Object.getPrototypeOf(StyleInjector.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(StyleInjector, [{
		key: 'setup',
		value: function setup(bin, input) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = input;
			bin.output.head.appendChild(link);
		}

		// TODO: Add teardown method
	}]);

	return StyleInjector;
})(_classesInjectorsInjector2['default']);

exports['default'] = StyleInjector;
module.exports = exports['default'];

},{"classes/injectors/Injector":8}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesOutputsOutput = require('classes/outputs/Output');

var _classesOutputsOutput2 = _interopRequireDefault(_classesOutputsOutput);

var FRAME = Symbol('frame');
var BLANK = 'about:blank';

var FrameOutput = (function (_Output) {
	_inherits(FrameOutput, _Output);

	function FrameOutput(element) {
		_classCallCheck(this, FrameOutput);

		_get(Object.getPrototypeOf(FrameOutput.prototype), 'constructor', this).call(this);
		this.frame = element || document.createElement('iframe');
	}

	_createClass(FrameOutput, [{
		key: 'reset',
		value: function reset() {
			this.frame.src = BLANK;
		}
	}, {
		key: 'frame',
		set: function set(value) {
			var element = value;
			if (typeof value === 'string') {
				element = document.querySelector(value);
			}
			this[FRAME] = element;
		},
		get: function get() {
			return this[FRAME];
		}
	}, {
		key: 'window',
		get: function get() {
			return this.frame.contentWindow;
		}
	}, {
		key: 'document',
		get: function get() {
			return this.window.document;
		}
	}, {
		key: 'head',
		get: function get() {
			return this.document.head;
		}
	}, {
		key: 'body',
		get: function get() {
			return this.document.body;
		}
	}]);

	return FrameOutput;
})(_classesOutputsOutput2['default']);

exports['default'] = FrameOutput;
module.exports = exports['default'];

},{"classes/outputs/Output":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _classesErrorsNotImplementedError = require('classes/errors/NotImplementedError');

var _classesErrorsNotImplementedError2 = _interopRequireDefault(_classesErrorsNotImplementedError);

var READY_LOOP_INTERVAL = 10;

var Output = (function () {
	function Output() {
		_classCallCheck(this, Output);
	}

	_createClass(Output, [{
		key: 'reset',
		value: function reset() {
			throw new _classesErrorsNotImplementedError2['default']('`reset` method must be implemented by subclass');
		}
	}, {
		key: 'ready',
		value: function ready(callback) {
			var _this = this;

			callback = typeof callback === 'function' ? callback : function () {};
			var loop = function loop() {
				try {
					// Both head and body elements must be present
					if (_this.head && _this.body) {
						callback();
						return;
					}
				} catch (err) {
					// No-op
				}
				setTimeout(loop, READY_LOOP_INTERVAL);
			};
			loop();
		}
	}, {
		key: 'window',
		get: function get() {
			throw new _classesErrorsNotImplementedError2['default']('`window` getter must be implemented by subclass');
		}
	}, {
		key: 'document',
		get: function get() {
			throw new _classesErrorsNotImplementedError2['default']('`document` getter must be implemented by subclass');
		}
	}, {
		key: 'head',
		get: function get() {
			throw new _classesErrorsNotImplementedError2['default']('`head` getter must be implemented by subclass');
		}
	}, {
		key: 'body',
		get: function get() {
			throw new _classesErrorsNotImplementedError2['default']('`body` getter must be implemented by subclass');
		}
	}]);

	return Output;
})();

exports['default'] = Output;
module.exports = exports['default'];

},{"classes/errors/NotImplementedError":5}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesOutputsOutput = require('classes/outputs/Output');

var _classesOutputsOutput2 = _interopRequireDefault(_classesOutputsOutput);

var WINDOW = Symbol('frame');
var BLANK = 'about:blank';

var WindowOutput = (function (_Output) {
	_inherits(WindowOutput, _Output);

	function WindowOutput(win) {
		_classCallCheck(this, WindowOutput);

		_get(Object.getPrototypeOf(WindowOutput.prototype), 'constructor', this).call(this);
		this.window = win;
	}

	_createClass(WindowOutput, [{
		key: 'reset',
		value: function reset() {
			this.window.location = BLANK;
		}
	}, {
		key: 'window',
		set: function set(val) {
			this[WINDOW] = val;
		},
		get: function get() {
			return this[WINDOW];
		}
	}, {
		key: 'document',
		get: function get() {
			return this.window.document;
		}
	}, {
		key: 'head',
		get: function get() {
			return this.document.head;
		}
	}, {
		key: 'body',
		get: function get() {
			return this.document.body;
		}
	}]);

	return WindowOutput;
})(_classesOutputsOutput2['default']);

exports['default'] = WindowOutput;
module.exports = exports['default'];

},{"classes/outputs/Output":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesSourcesSource = require('classes/sources/Source');

var _classesSourcesSource2 = _interopRequireDefault(_classesSourcesSource);

var EditorSource = (function (_Source) {
	_inherits(EditorSource, _Source);

	function EditorSource(editor) {
		_classCallCheck(this, EditorSource);

		_get(Object.getPrototypeOf(EditorSource.prototype), 'constructor', this).call(this);
		this.editor = editor;
	}

	_createClass(EditorSource, [{
		key: 'getValue',
		value: function getValue() {
			return Promise.resolve(this.editor.getValue());
		}
	}, {
		key: 'triggerChange',
		value: function triggerChange() {
			this.emit('change');
		}
	}]);

	return EditorSource;
})(_classesSourcesSource2['default']);

exports['default'] = EditorSource;
module.exports = exports['default'];

},{"classes/sources/Source":18}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesSourcesSource = require('classes/sources/Source');

var _classesSourcesSource2 = _interopRequireDefault(_classesSourcesSource);

var _classesFileWatcher = require('classes/FileWatcher');

var _classesFileWatcher2 = _interopRequireDefault(_classesFileWatcher);

var FileSource = (function (_Source) {
	_inherits(FileSource, _Source);

	function FileSource(file) {
		var _this = this;

		_classCallCheck(this, FileSource);

		_get(Object.getPrototypeOf(FileSource.prototype), 'constructor', this).call(this);
		if (!file) {
			throw new Error('FileSource must be initialized with file');
		}
		this.file = file;
		this.watcher = new _classesFileWatcher2['default'](this.file);
		this.watcher.on('change', function () {
			return _this.handleFileChange();
		});
		this.watcher.watching = true;
	}

	_createClass(FileSource, [{
		key: 'handleFileChange',
		value: function handleFileChange() {
			this.emit('change');
		}
	}, {
		key: 'getValue',
		value: function getValue() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				var reader = new FileReader();
				reader.onload = function (e) {
					return resolve(e.target.result);
				};
				reader.onerror = reject;
				reader.readAsText(_this2.file);
			});
		}
	}]);

	return FileSource;
})(_classesSourcesSource2['default']);

exports['default'] = FileSource;
module.exports = exports['default'];

},{"classes/FileWatcher":3,"classes/sources/Source":18}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesSourcesSource = require('classes/sources/Source');

var _classesSourcesSource2 = _interopRequireDefault(_classesSourcesSource);

var LinkSource = (function (_Source) {
	_inherits(LinkSource, _Source);

	function LinkSource(uri) {
		_classCallCheck(this, LinkSource);

		_get(Object.getPrototypeOf(LinkSource.prototype), 'constructor', this).call(this);
		this.uri = uri;
	}

	_createClass(LinkSource, [{
		key: 'getValue',
		value: function getValue() {
			return this.uri;
		}
	}]);

	return LinkSource;
})(_classesSourcesSource2['default']);

exports['default'] = LinkSource;
module.exports = exports['default'];

},{"classes/sources/Source":18}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesEmitter = require('classes/Emitter');

var _classesEmitter2 = _interopRequireDefault(_classesEmitter);

var _classesErrorsNotImplementedError = require('classes/errors/NotImplementedError');

var _classesErrorsNotImplementedError2 = _interopRequireDefault(_classesErrorsNotImplementedError);

var Source = (function (_Emitter) {
	_inherits(Source, _Emitter);

	function Source() {
		_classCallCheck(this, Source);

		_get(Object.getPrototypeOf(Source.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Source, [{
		key: 'addTo',
		value: function addTo(bin) {
			var _this = this;

			return Promise.resolve(this.getValue()).then(function (value) {
				return _this.transform(value);
			}).then(function (input) {
				return _this.injector.setup(bin, input);
			});
		}
	}, {
		key: 'getValue',
		value: function getValue() {
			throw new _classesErrorsNotImplementedError2['default']('Source value getter must be implemented by subclass');
		}
	}, {
		key: 'transform',
		value: function transform(input) {
			if (this.transformer) {
				return this.transformer.transform(input);
			}
			return input;
		}
	}]);

	return Source;
})(_classesEmitter2['default']);

exports['default'] = Source;
module.exports = exports['default'];

},{"classes/Emitter":2,"classes/errors/NotImplementedError":5}],19:[function(require,module,exports){
/* global babel */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _classesTransformersTransformer = require('classes/transformers/Transformer');

var _classesTransformersTransformer2 = _interopRequireDefault(_classesTransformersTransformer);

var BabelTransformer = (function (_Transformer) {
	_inherits(BabelTransformer, _Transformer);

	function BabelTransformer() {
		_classCallCheck(this, BabelTransformer);

		_get(Object.getPrototypeOf(BabelTransformer.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(BabelTransformer, [{
		key: 'transform',
		value: function transform(input) {
			var result = babel.transform(input);
			var output = result.code;
			return output;
		}
	}]);

	return BabelTransformer;
})(_classesTransformersTransformer2['default']);

exports['default'] = BabelTransformer;
module.exports = exports['default'];

},{"classes/transformers/Transformer":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transformer = (function () {
	function Transformer() {
		_classCallCheck(this, Transformer);
	}

	_createClass(Transformer, [{
		key: "transform",
		value: function transform(input) {
			// Pass through
			return input;
		}
	}]);

	return Transformer;
})();

exports["default"] = Transformer;
module.exports = exports["default"];

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classesBin = require('classes/Bin');

var _classesBin2 = _interopRequireDefault(_classesBin);

var _classesEmitter = require('classes/Emitter');

var _classesEmitter2 = _interopRequireDefault(_classesEmitter);

var _classesFileWatcher = require('classes/FileWatcher');

var _classesFileWatcher2 = _interopRequireDefault(_classesFileWatcher);

var _classesErrorsError = require('classes/errors/Error');

var _classesErrorsError2 = _interopRequireDefault(_classesErrorsError);

var _classesErrorsNotImplementedError = require('classes/errors/NotImplementedError');

var _classesErrorsNotImplementedError2 = _interopRequireDefault(_classesErrorsNotImplementedError);

var _classesInjectorsInjector = require('classes/injectors/Injector');

var _classesInjectorsInjector2 = _interopRequireDefault(_classesInjectorsInjector);

var _classesInjectorsCSSInjector = require('classes/injectors/CSSInjector');

var _classesInjectorsCSSInjector2 = _interopRequireDefault(_classesInjectorsCSSInjector);

var _classesInjectorsHTMLInjector = require('classes/injectors/HTMLInjector');

var _classesInjectorsHTMLInjector2 = _interopRequireDefault(_classesInjectorsHTMLInjector);

var _classesInjectorsJSInjector = require('classes/injectors/JSInjector');

var _classesInjectorsJSInjector2 = _interopRequireDefault(_classesInjectorsJSInjector);

var _classesInjectorsScriptInjector = require('classes/injectors/ScriptInjector');

var _classesInjectorsScriptInjector2 = _interopRequireDefault(_classesInjectorsScriptInjector);

var _classesInjectorsStyleInjector = require('classes/injectors/StyleInjector');

var _classesInjectorsStyleInjector2 = _interopRequireDefault(_classesInjectorsStyleInjector);

var _classesOutputsOutput = require('classes/outputs/Output');

var _classesOutputsOutput2 = _interopRequireDefault(_classesOutputsOutput);

var _classesOutputsFrameOutput = require('classes/outputs/FrameOutput');

var _classesOutputsFrameOutput2 = _interopRequireDefault(_classesOutputsFrameOutput);

var _classesOutputsWindowOutput = require('classes/outputs/WindowOutput');

var _classesOutputsWindowOutput2 = _interopRequireDefault(_classesOutputsWindowOutput);

var _classesSourcesSource = require('classes/sources/Source');

var _classesSourcesSource2 = _interopRequireDefault(_classesSourcesSource);

var _classesSourcesEditorSource = require('classes/sources/EditorSource');

var _classesSourcesEditorSource2 = _interopRequireDefault(_classesSourcesEditorSource);

var _classesSourcesFileSource = require('classes/sources/FileSource');

var _classesSourcesFileSource2 = _interopRequireDefault(_classesSourcesFileSource);

var _classesSourcesLinkSource = require('classes/sources/LinkSource');

var _classesSourcesLinkSource2 = _interopRequireDefault(_classesSourcesLinkSource);

var _classesTransformersTransformer = require('classes/transformers/Transformer');

var _classesTransformersTransformer2 = _interopRequireDefault(_classesTransformersTransformer);

var _classesTransformersBabelTransformer = require('classes/transformers/BabelTransformer');

var _classesTransformersBabelTransformer2 = _interopRequireDefault(_classesTransformersBabelTransformer);

exports['default'] = _classesBin2['default'];
exports.Bin = _classesBin2['default'];
exports.Emitter = _classesEmitter2['default'];
exports.FileWatcher = _classesFileWatcher2['default'];
exports.Error = _classesErrorsError2['default'];
exports.NotImplementedError = _classesErrorsNotImplementedError2['default'];
exports.Injector = _classesInjectorsInjector2['default'];
exports.CSSInjector = _classesInjectorsCSSInjector2['default'];
exports.HTMLInjector = _classesInjectorsHTMLInjector2['default'];
exports.JSInjector = _classesInjectorsJSInjector2['default'];
exports.ScriptInjector = _classesInjectorsScriptInjector2['default'];
exports.StyleInjector = _classesInjectorsStyleInjector2['default'];
exports.Output = _classesOutputsOutput2['default'];
exports.FrameOutput = _classesOutputsFrameOutput2['default'];
exports.WindowOutput = _classesOutputsWindowOutput2['default'];
exports.Source = _classesSourcesSource2['default'];
exports.EditorSource = _classesSourcesEditorSource2['default'];
exports.FileSource = _classesSourcesFileSource2['default'];
exports.LinkSource = _classesSourcesLinkSource2['default'];
exports.Transformer = _classesTransformersTransformer2['default'];
exports.BabelTransformer = _classesTransformersBabelTransformer2['default'];

},{"classes/Bin":1,"classes/Emitter":2,"classes/FileWatcher":3,"classes/errors/Error":4,"classes/errors/NotImplementedError":5,"classes/injectors/CSSInjector":6,"classes/injectors/HTMLInjector":7,"classes/injectors/Injector":8,"classes/injectors/JSInjector":9,"classes/injectors/ScriptInjector":10,"classes/injectors/StyleInjector":11,"classes/outputs/FrameOutput":12,"classes/outputs/Output":13,"classes/outputs/WindowOutput":14,"classes/sources/EditorSource":15,"classes/sources/FileSource":16,"classes/sources/LinkSource":17,"classes/sources/Source":18,"classes/transformers/BabelTransformer":19,"classes/transformers/Transformer":20}]},{},[21])(21)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvQmluLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL0VtaXR0ZXIuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvRmlsZVdhdGNoZXIuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvZXJyb3JzL0Vycm9yLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL2Vycm9ycy9Ob3RJbXBsZW1lbnRlZEVycm9yLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL2luamVjdG9ycy9DU1NJbmplY3Rvci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9pbmplY3RvcnMvSFRNTEluamVjdG9yLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL2luamVjdG9ycy9JbmplY3Rvci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9pbmplY3RvcnMvSlNJbmplY3Rvci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9pbmplY3RvcnMvU2NyaXB0SW5qZWN0b3IuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvaW5qZWN0b3JzL1N0eWxlSW5qZWN0b3IuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvb3V0cHV0cy9GcmFtZU91dHB1dC5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9vdXRwdXRzL091dHB1dC5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9vdXRwdXRzL1dpbmRvd091dHB1dC5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9zb3VyY2VzL0VkaXRvclNvdXJjZS5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9zb3VyY2VzL0ZpbGVTb3VyY2UuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvc291cmNlcy9MaW5rU291cmNlLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL3NvdXJjZXMvU291cmNlLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL3RyYW5zZm9ybWVycy9CYWJlbFRyYW5zZm9ybWVyLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL3RyYW5zZm9ybWVycy9UcmFuc2Zvcm1lci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvcGFydHMtYmluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O29DQ0FtQix3QkFBd0I7Ozs7SUFFckMsR0FBRztBQUNJLFVBRFAsR0FBRyxHQUNtQjs7O01BQWQsT0FBTyx5REFBRyxFQUFFOzt3QkFEcEIsR0FBRzs7QUFFUCxNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3JDLE1BQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSx1Q0FBWSxDQUFDO0FBQzdDLE1BQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtVQUFLLE1BQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7R0FBQSxDQUFDLENBQUM7RUFDckU7O2NBTEksR0FBRzs7U0FPTyx3QkFBQyxNQUFNLEVBQWU7OztPQUFiLElBQUkseURBQUcsSUFBSTs7QUFDbEMsT0FBSSxJQUFJLEVBQUU7QUFDVCxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQjtBQUNELFNBQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1dBQU0sT0FBSyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7SUFBQSxDQUFDLENBQUM7R0FDM0Q7OztTQUVnQiwwQkFBQyxNQUFNLEVBQWdCO09BQWQsS0FBSyx5REFBRyxJQUFJOztBQUNyQyxRQUFLLElBQUksQ0FB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bkUsR0FBRztRQUNILE9BQU87UUFDUCxXQUFXO1FBT1gsS0FBSztRQUNMLG1CQUFtQjtRQVduQixRQUFRO1FBQ1IsV0FBVztRQUNYLFlBQVk7UUFDWixVQUFVO1FBQ1YsY0FBYztRQUNkLGFBQWE7UUFRYixNQUFNO1FBQ04sV0FBVztRQUNYLFlBQVk7UUFTWixNQUFNO1FBQ04sWUFBWTtRQUNaLFVBQVU7UUFDVixVQUFVO1FBT1YsV0FBVztRQUNYLGdCQUFnQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgT3V0cHV0IGZyb20gJ2NsYXNzZXMvb3V0cHV0cy9PdXRwdXQnO1xyXG5cclxuY2xhc3MgQmluIHtcclxuXHRjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLnNvdXJjZXMgPSBvcHRpb25zLnNvdXJjZXMgfHwgW107XHJcblx0XHR0aGlzLm91dHB1dCA9IG9wdGlvbnMub3V0cHV0IHx8IG5ldyBPdXRwdXQoKTtcclxuXHRcdHRoaXMuc291cmNlcy5mb3JFYWNoKChzb3VyY2UpID0+IHRoaXMucmVnaXN0ZXJTb3VyY2Uoc291cmNlLCBmYWxzZSkpO1xyXG5cdH1cclxuXHJcblx0cmVnaXN0ZXJTb3VyY2UgKHNvdXJjZSwgcHVzaCA9IHRydWUpIHtcclxuXHRcdGlmIChwdXNoKSB7XHJcblx0XHRcdHRoaXMuc291cmNlcy5wdXNoKHNvdXJjZSk7XHJcblx0XHR9XHJcblx0XHRzb3VyY2Uub24oJ2NoYW5nZScsICgpID0+IHRoaXMuaGFuZGxlU291cmNlQ2hhbmdlKHNvdXJjZSkpO1xyXG5cdH1cclxuXHJcblx0dW5yZWdpc3RlclNvdXJjZSAoc291cmNlLCByZXNldCA9IHRydWUpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnNvdXJjZXNbaV0gPT09IHNvdXJjZSkge1xyXG5cdFx0XHRcdHRoaXMuc291cmNlcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0Ly8gVE9ETzogUmVtb3ZlICdjaGFuZ2UnIGxpc3RlbmVyIGZyb20gc291cmNlXHJcblx0XHRcdFx0Ly8gT25seSByZW1vdmUgdGhlIGZpcnN0IGluc3RhbmNlIG9mIHRoaXMgc291cmNlXHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChyZXNldCkge1xyXG5cdFx0XHR0aGlzLnJlc2V0T3V0cHV0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhZGRBbGxTb3VyY2VzICgpIHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoYWNjZXB0LCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGNoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblx0XHRcdHRoaXMuc291cmNlcy5mb3JFYWNoKChzb3VyY2UpID0+IHtcclxuXHRcdFx0XHRjaGFpbiA9IGNoYWluXHJcblx0XHRcdFx0XHQudGhlbigoKSA9PiB0aGlzLmFkZFNvdXJjZShzb3VyY2UpKVxyXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjaGFpbi50aGVuKGFjY2VwdCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGFkZFNvdXJjZSAoc291cmNlKSB7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNvdXJjZS5hZGRUbyh0aGlzKSk7XHJcblx0fVxyXG5cclxuXHRoYW5kbGVTb3VyY2VDaGFuZ2UgKHNvdXJjZSkge1xyXG5cdFx0Y29uc3QgcmVxdWlyZXNTZXR1cCA9IHNvdXJjZS5pbmplY3Rvci50ZWFyZG93bih0aGlzKTtcclxuXHRcdGlmIChyZXF1aXJlc1NldHVwKSB7XHJcblx0XHRcdHRoaXMuYWRkU291cmNlKHNvdXJjZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXNldE91dHB1dCAoKSB7XHJcblx0XHR0aGlzLm91dHB1dC5yZXNldCgpO1xyXG5cdFx0cmV0dXJuIHRoaXMub3V0cHV0LnJlYWR5KCgpID0+IHRoaXMuYWRkQWxsU291cmNlcygpKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJpbjtcclxuIiwiY29uc3QgRVZFTlRTID0gU3ltYm9sKCdldmVudHMnKTtcclxuXHJcbmNsYXNzIEVtaXR0ZXIge1xyXG5cdGNvbnN0cnVjdG9yICgpIHtcclxuXHRcdHRoaXNbRVZFTlRTXSA9IHt9O1xyXG5cdH1cclxuXHJcblx0b24gKGV2ZW50cywgbGlzdGVuZXIpIHtcclxuXHRcdGV2ZW50cy5zcGxpdCgvLD9cXHMrL2cpLmZvckVhY2goKGV2ZW50KSA9PiB7XHJcblx0XHRcdHRoaXNbRVZFTlRTXVtldmVudF0gPSB0aGlzW0VWRU5UU11bZXZlbnRdIHx8IFtdO1xyXG5cdFx0XHR0aGlzW0VWRU5UU11bZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdG9uY2UgKGV2ZW50LCBsaXN0ZW5lcikge1xyXG5cdFx0Y29uc3QgY2FsbGJhY2sgPSAoLi4uYXJncykgPT4ge1xyXG5cdFx0XHR0aGlzLm9mZihldmVudCwgY2FsbGJhY2spO1xyXG5cdFx0XHRSZWZsZWN0LmFwcGx5KGxpc3RlbmVyLCB0aGlzLCBhcmdzKTtcclxuXHRcdH07XHJcblx0XHRjYWxsYmFjay5saXN0ZW5lciA9IGxpc3RlbmVyO1xyXG5cdFx0dGhpcy5vbihldmVudCwgY2FsbGJhY2spO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRvZmYgKGV2ZW50LCBsaXN0ZW5lcikge1xyXG5cdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpc1tFVkVOVFNdW2V2ZW50XTtcclxuXHRcdGlmICghbGlzdGVuZXJzKSB7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFsaXN0ZW5lcikge1xyXG5cdFx0XHR0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhldmVudCk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgY3VycmVudCA9IGxpc3RlbmVyc1tpXTtcclxuXHRcdFx0aWYgKGN1cnJlbnQgPT09IGxpc3RlbmVyIHx8IGN1cnJlbnQubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XHJcblx0XHRcdFx0bGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChsaXN0ZW5lcnMubGVuZ3RoIDw9IDApIHtcclxuXHRcdFx0dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRyZW1vdmVBbGxMaXN0ZW5lcnMgKGV2ZW50KSB7XHJcblx0XHRpZiAoZXZlbnQpIHtcclxuXHRcdFx0UmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0aGlzW0VWRU5UU10sIGV2ZW50KTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzW0VWRU5UU10gPSB7fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0ZW1pdCAoZXZlbnQsIC4uLmFyZ3MpIHtcclxuXHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXNbRVZFTlRTXVtldmVudF07XHJcblx0XHRpZiAoIWxpc3RlbmVycykge1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHRcdGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gUmVmbGVjdC5hcHBseShsaXN0ZW5lciwgdGhpcywgYXJncykpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbWl0dGVyO1xyXG4iLCJpbXBvcnQgRW1pdHRlciBmcm9tICdjbGFzc2VzL0VtaXR0ZXInO1xyXG5cclxuY29uc3QgSU5URVJWQUwgPSBTeW1ib2woJ2ludGVydmFsJyk7XHJcbmNvbnN0IE1PRElGSUVEID0gU3ltYm9sKCdsYXN0TW9kaWZpZWQnKTtcclxuXHJcbmNsYXNzIEZpbGVXYXRjaGVyIGV4dGVuZHMgRW1pdHRlciB7XHJcblx0Y29uc3RydWN0b3IgKGZpbGUsIGludGVydmFsID0gRmlsZVdhdGNoZXIuREVGQVVMVF9JTlRFUlZBTCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdGlmICghKGZpbGUgaW5zdGFuY2VvZiBGaWxlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZpbGVXYXRjaGVyIG11c3QgYmUgaW5pdGlhbGl6ZWQgd2l0aCBhIGZpbGUgdG8gd2F0Y2gnKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaW50ZXJ2YWwgPSBpbnRlcnZhbDtcclxuXHRcdHRoaXMuZmlsZSA9IGZpbGU7XHJcblx0XHR0aGlzW01PRElGSUVEXSA9IGZpbGUubGFzdE1vZGlmaWVkO1xyXG5cdH1cclxuXHJcblx0c2V0IHdhdGNoaW5nICh2YWx1ZSkge1xyXG5cdFx0aWYgKHZhbHVlIHx8IHRoaXNbSU5URVJWQUxdKSB7XHJcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpc1tJTlRFUlZBTF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXNbSU5URVJWQUxdID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5sb29wKCksIHRoaXMuaW50ZXJ2YWwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9vcCAoKSB7XHJcblx0XHRpZiAodGhpcy5maWxlLmxhc3RNb2RpZmllZCAhPT0gdGhpc1tNT0RJRklFRF0gJiYgdGhpcy5maWxlLnNpemUgPiAwKSB7XHJcblx0XHRcdHRoaXMuZGlkQ2hhbmdlKCk7XHJcblx0XHRcdHRoaXNbTU9ESUZJRURdID0gdGhpcy5maWxlLmxhc3RNb2RpZmllZDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRpZENoYW5nZSAoKSB7XHJcblx0XHR0aGlzLmVtaXQoJ2NoYW5nZScsIHRoaXMuZmlsZSk7XHJcblx0fVxyXG59XHJcblxyXG5GaWxlV2F0Y2hlci5ERUZBVUxUX0lOVEVSVkFMID0gMTAwO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsZVdhdGNoZXI7XHJcbiIsImNsYXNzIEJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcclxuXHRjb25zdHJ1Y3RvciAobWVzc2FnZSkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcblx0fVxyXG5cclxuXHRnZXQgbmFtZSAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZUVycm9yO1xyXG4iLCJpbXBvcnQgRXJyb3IgZnJvbSAnY2xhc3Nlcy9lcnJvcnMvRXJyb3InO1xyXG5cclxuY2xhc3MgTm90SW1wbGVtZW50ZWRFcnJvciBleHRlbmRzIEVycm9yIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdEltcGxlbWVudGVkRXJyb3I7XHJcbiIsImltcG9ydCBJbmplY3RvciBmcm9tICdjbGFzc2VzL2luamVjdG9ycy9JbmplY3Rvcic7XHJcblxyXG5jbGFzcyBDU1NJbmplY3RvciBleHRlbmRzIEluamVjdG9yIHtcclxuXHRzZXR1cCAoYmluLCBpbnB1dCkge1xyXG5cdFx0Y29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdFx0c3R5bGUuaW5uZXJIVE1MID0gaW5wdXQ7XHJcblx0XHRiaW4ub3V0cHV0LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG5cdH1cclxuXHJcblx0Ly8gVE9ETzogQWRkIHRlYXJkb3duIG1ldGhvZFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDU1NJbmplY3RvcjtcclxuIiwiaW1wb3J0IEluamVjdG9yIGZyb20gJ2NsYXNzZXMvaW5qZWN0b3JzL0luamVjdG9yJztcclxuXHJcbmNsYXNzIEhUTUxJbmplY3RvciBleHRlbmRzIEluamVjdG9yIHtcclxuXHRzZXR1cCAoYmluLCBpbnB1dCkge1xyXG5cdFx0Ly8gQ3JlYXRlIHRlbXBvcmFyeSBwYXJlbnQgY29udGFpbmVyXHJcblx0XHRjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHR0ZW1wLmlubmVySFRNTCA9IGlucHV0O1xyXG5cdFx0Y29uc3QgY2hpbGRyZW4gPSB0ZW1wLmNoaWxkTm9kZXM7XHJcblx0XHRjb25zdCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cdFx0d2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG5cdFx0XHRmcmFnLmFwcGVuZENoaWxkKGNoaWxkcmVuWzBdKTtcclxuXHRcdH1cclxuXHRcdGJpbi5vdXRwdXQuYm9keS5hcHBlbmRDaGlsZChmcmFnKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhUTUxJbmplY3RvcjtcclxuIiwiaW1wb3J0IE5vdEltcGxlbWVudGVkRXJyb3IgZnJvbSAnY2xhc3Nlcy9lcnJvcnMvTm90SW1wbGVtZW50ZWRFcnJvcic7XHJcblxyXG5jbGFzcyBJbmplY3RvciB7XHJcblx0c2V0dXAgKCkge1xyXG5cdFx0dGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoJ0luamVjdGlvbiBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XHJcblx0fVxyXG5cclxuXHR0ZWFyZG93biAoYmluKSB7XHJcblx0XHQvLyBEZWZhdWx0IGJlaGF2aW91ciBpcyB0byByZXNldCB0aGUgYmluXHJcblx0XHRiaW4ucmVzZXRPdXRwdXQoKTtcclxuXHRcdC8vIFJldHVybiBgdHJ1ZWAgaWYgdGhlIHNldHVwIG5lZWRzIHRvIGJlIGV4cGxpY2l0bHkgY2FsbGVkIGFnYWluXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJbmplY3RvcjtcclxuIiwiaW1wb3J0IEluamVjdG9yIGZyb20gJ2NsYXNzZXMvaW5qZWN0b3JzL0luamVjdG9yJztcclxuXHJcbmNsYXNzIEpTSW5qZWN0b3IgZXh0ZW5kcyBJbmplY3RvciB7XHJcblx0c2V0dXAgKGJpbiwgaW5wdXQpIHtcclxuXHRcdGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IGlucHV0O1xyXG5cdFx0YmluLm91dHB1dC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBKU0luamVjdG9yO1xyXG4iLCJpbXBvcnQgSW5qZWN0b3IgZnJvbSAnY2xhc3Nlcy9pbmplY3RvcnMvSW5qZWN0b3InO1xyXG5cclxuY2xhc3MgU2NyaXB0SW5qZWN0b3IgZXh0ZW5kcyBJbmplY3RvciB7XHJcblx0c2V0dXAgKGJpbiwgaW5wdXQpIHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoYWNjZXB0LCByZWplY3QpID0+IHtcclxuXHRcdFx0Y29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcblx0XHRcdHNjcmlwdC5zcmMgPSBpbnB1dDtcclxuXHRcdFx0c2NyaXB0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiBhY2NlcHQoc2NyaXB0KSk7XHJcblx0XHRcdHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHJlamVjdChuZXcgRXJyb3IoJ0NvdWxkIG5vdCBsb2FkIHNjcmlwdCcpKSk7XHJcblx0XHRcdGJpbi5vdXRwdXQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY3JpcHRJbmplY3RvcjtcclxuIiwiaW1wb3J0IEluamVjdG9yIGZyb20gJ2NsYXNzZXMvaW5qZWN0b3JzL0luamVjdG9yJztcclxuXHJcbmNsYXNzIFN0eWxlSW5qZWN0b3IgZXh0ZW5kcyBJbmplY3RvciB7XHJcblx0c2V0dXAgKGJpbiwgaW5wdXQpIHtcclxuXHRcdGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XHJcblx0XHRsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcclxuXHRcdGxpbmsuaHJlZiA9IGlucHV0O1xyXG5cdFx0YmluLm91dHB1dC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xyXG5cdH1cclxuXHJcblx0Ly8gVE9ETzogQWRkIHRlYXJkb3duIG1ldGhvZFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTdHlsZUluamVjdG9yO1xyXG4iLCJpbXBvcnQgT3V0cHV0IGZyb20gJ2NsYXNzZXMvb3V0cHV0cy9PdXRwdXQnO1xyXG5cclxuY29uc3QgRlJBTUUgPSBTeW1ib2woJ2ZyYW1lJyk7XHJcbmNvbnN0IEJMQU5LID0gJ2Fib3V0OmJsYW5rJztcclxuXHJcbmNsYXNzIEZyYW1lT3V0cHV0IGV4dGVuZHMgT3V0cHV0IHtcclxuXHRjb25zdHJ1Y3RvciAoZWxlbWVudCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMuZnJhbWUgPSBlbGVtZW50IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG5cdH1cclxuXHJcblx0c2V0IGZyYW1lICh2YWx1ZSkge1xyXG5cdFx0bGV0IGVsZW1lbnQgPSB2YWx1ZTtcclxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdHRoaXNbRlJBTUVdID0gZWxlbWVudDtcclxuXHR9XHJcblxyXG5cdGdldCBmcmFtZSAoKSB7XHJcblx0XHRyZXR1cm4gdGhpc1tGUkFNRV07XHJcblx0fVxyXG5cclxuXHRnZXQgd2luZG93ICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmZyYW1lLmNvbnRlbnRXaW5kb3c7XHJcblx0fVxyXG5cclxuXHRnZXQgZG9jdW1lbnQgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMud2luZG93LmRvY3VtZW50O1xyXG5cdH1cclxuXHJcblx0Z2V0IGhlYWQgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZG9jdW1lbnQuaGVhZDtcclxuXHR9XHJcblxyXG5cdGdldCBib2R5ICgpIHtcclxuXHRcdHJldHVybiB0aGlzLmRvY3VtZW50LmJvZHk7XHJcblx0fVxyXG5cclxuXHRyZXNldCAoKSB7XHJcblx0XHR0aGlzLmZyYW1lLnNyYyA9IEJMQU5LO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRnJhbWVPdXRwdXQ7XHJcbiIsImltcG9ydCBOb3RJbXBsZW1lbnRlZEVycm9yIGZyb20gJ2NsYXNzZXMvZXJyb3JzL05vdEltcGxlbWVudGVkRXJyb3InO1xyXG5cclxuY29uc3QgUkVBRFlfTE9PUF9JTlRFUlZBTCA9IDEwO1xyXG5cclxuY2xhc3MgT3V0cHV0IHtcclxuXHRnZXQgd2luZG93ICgpIHtcclxuXHRcdHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKCdgd2luZG93YCBnZXR0ZXIgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpO1xyXG5cdH1cclxuXHJcblx0Z2V0IGRvY3VtZW50ICgpIHtcclxuXHRcdHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKCdgZG9jdW1lbnRgIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XHJcblx0fVxyXG5cclxuXHRnZXQgaGVhZCAoKSB7XHJcblx0XHR0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcignYGhlYWRgIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XHJcblx0fVxyXG5cclxuXHRnZXQgYm9keSAoKSB7XHJcblx0XHR0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcignYGJvZHlgIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XHJcblx0fVxyXG5cclxuXHRyZXNldCAoKSB7XHJcblx0XHR0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcignYHJlc2V0YCBtZXRob2QgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpO1xyXG5cdH1cclxuXHJcblx0cmVhZHkgKGNhbGxiYWNrKSB7XHJcblx0XHRjYWxsYmFjayA9ICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpID8gY2FsbGJhY2sgOiAoKSA9PiB7fTtcclxuXHRcdGNvbnN0IGxvb3AgPSAoKSA9PiB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0Ly8gQm90aCBoZWFkIGFuZCBib2R5IGVsZW1lbnRzIG11c3QgYmUgcHJlc2VudFxyXG5cdFx0XHRcdGlmICh0aGlzLmhlYWQgJiYgdGhpcy5ib2R5KSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjaygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0Ly8gTm8tb3BcclxuXHRcdFx0fVxyXG5cdFx0XHRzZXRUaW1lb3V0KGxvb3AsIFJFQURZX0xPT1BfSU5URVJWQUwpO1xyXG5cdFx0fTtcclxuXHRcdGxvb3AoKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE91dHB1dDtcclxuIiwiaW1wb3J0IE91dHB1dCBmcm9tICdjbGFzc2VzL291dHB1dHMvT3V0cHV0JztcclxuXHJcbmNvbnN0IFdJTkRPVyA9IFN5bWJvbCgnZnJhbWUnKTtcclxuY29uc3QgQkxBTksgPSAnYWJvdXQ6YmxhbmsnO1xyXG5cclxuY2xhc3MgV2luZG93T3V0cHV0IGV4dGVuZHMgT3V0cHV0IHtcclxuXHRjb25zdHJ1Y3RvciAod2luKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy53aW5kb3cgPSB3aW47XHJcblx0fVxyXG5cclxuXHRzZXQgd2luZG93ICh2YWwpIHtcclxuXHRcdHRoaXNbV0lORE9XXSA9IHZhbDtcclxuXHR9XHJcblxyXG5cdGdldCB3aW5kb3cgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXNbV0lORE9XXTtcclxuXHR9XHJcblxyXG5cdGdldCBkb2N1bWVudCAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy53aW5kb3cuZG9jdW1lbnQ7XHJcblx0fVxyXG5cclxuXHRnZXQgaGVhZCAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5kb2N1bWVudC5oZWFkO1xyXG5cdH1cclxuXHJcblx0Z2V0IGJvZHkgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZG9jdW1lbnQuYm9keTtcclxuXHR9XHJcblxyXG5cdHJlc2V0ICgpIHtcclxuXHRcdHRoaXMud2luZG93LmxvY2F0aW9uID0gQkxBTks7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXaW5kb3dPdXRwdXQ7XHJcbiIsImltcG9ydCBTb3VyY2UgZnJvbSAnY2xhc3Nlcy9zb3VyY2VzL1NvdXJjZSc7XHJcblxyXG5jbGFzcyBFZGl0b3JTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xyXG5cdGNvbnN0cnVjdG9yIChlZGl0b3IpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLmVkaXRvciA9IGVkaXRvcjtcclxuXHR9XHJcblxyXG5cdGdldFZhbHVlICgpIHtcclxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5lZGl0b3IuZ2V0VmFsdWUoKSk7XHJcblx0fVxyXG5cclxuXHR0cmlnZ2VyQ2hhbmdlICgpIHtcclxuXHRcdHRoaXMuZW1pdCgnY2hhbmdlJyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFZGl0b3JTb3VyY2U7XHJcbiIsImltcG9ydCBTb3VyY2UgZnJvbSAnY2xhc3Nlcy9zb3VyY2VzL1NvdXJjZSc7XHJcbmltcG9ydCBGaWxlV2F0Y2hlciBmcm9tICdjbGFzc2VzL0ZpbGVXYXRjaGVyJztcclxuXHJcbmNsYXNzIEZpbGVTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xyXG5cdGNvbnN0cnVjdG9yIChmaWxlKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0aWYgKCFmaWxlKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignRmlsZVNvdXJjZSBtdXN0IGJlIGluaXRpYWxpemVkIHdpdGggZmlsZScpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5maWxlID0gZmlsZTtcclxuXHRcdHRoaXMud2F0Y2hlciA9IG5ldyBGaWxlV2F0Y2hlcih0aGlzLmZpbGUpO1xyXG5cdFx0dGhpcy53YXRjaGVyLm9uKCdjaGFuZ2UnLCAoKSA9PiB0aGlzLmhhbmRsZUZpbGVDaGFuZ2UoKSk7XHJcblx0XHR0aGlzLndhdGNoZXIud2F0Y2hpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0aGFuZGxlRmlsZUNoYW5nZSAoKSB7XHJcblx0XHR0aGlzLmVtaXQoJ2NoYW5nZScpO1xyXG5cdH1cclxuXHJcblx0Z2V0VmFsdWUgKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0Y29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHRcdFx0cmVhZGVyLm9ubG9hZCA9IChlKSA9PiByZXNvbHZlKGUudGFyZ2V0LnJlc3VsdCk7XHJcblx0XHRcdHJlYWRlci5vbmVycm9yID0gcmVqZWN0O1xyXG5cdFx0XHRyZWFkZXIucmVhZEFzVGV4dCh0aGlzLmZpbGUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWxlU291cmNlO1xyXG4iLCJpbXBvcnQgU291cmNlIGZyb20gJ2NsYXNzZXMvc291cmNlcy9Tb3VyY2UnO1xyXG5cclxuY2xhc3MgTGlua1NvdXJjZSBleHRlbmRzIFNvdXJjZSB7XHJcblx0Y29uc3RydWN0b3IgKHVyaSkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHRcdHRoaXMudXJpID0gdXJpO1xyXG5cdH1cclxuXHJcblx0Z2V0VmFsdWUgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMudXJpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTGlua1NvdXJjZTtcclxuIiwiaW1wb3J0IEVtaXR0ZXIgZnJvbSAnY2xhc3Nlcy9FbWl0dGVyJztcclxuaW1wb3J0IE5vdEltcGxlbWVudGVkRXJyb3IgZnJvbSAnY2xhc3Nlcy9lcnJvcnMvTm90SW1wbGVtZW50ZWRFcnJvcic7XHJcblxyXG5jbGFzcyBTb3VyY2UgZXh0ZW5kcyBFbWl0dGVyIHtcclxuXHRhZGRUbyAoYmluKSB7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuZ2V0VmFsdWUoKSlcclxuXHRcdFx0LnRoZW4oKHZhbHVlKSA9PiB0aGlzLnRyYW5zZm9ybSh2YWx1ZSkpXHJcblx0XHRcdC50aGVuKChpbnB1dCkgPT4gdGhpcy5pbmplY3Rvci5zZXR1cChiaW4sIGlucHV0KSk7XHJcblx0fVxyXG5cclxuXHRnZXRWYWx1ZSAoKSB7XHJcblx0XHR0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcignU291cmNlIHZhbHVlIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XHJcblx0fVxyXG5cclxuXHR0cmFuc2Zvcm0gKGlucHV0KSB7XHJcblx0XHRpZiAodGhpcy50cmFuc2Zvcm1lcikge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy50cmFuc2Zvcm1lci50cmFuc2Zvcm0oaW5wdXQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGlucHV0O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU291cmNlO1xyXG4iLCIvKiBnbG9iYWwgYmFiZWwgKi9cclxuXHJcbmltcG9ydCBUcmFuc2Zvcm1lciBmcm9tICdjbGFzc2VzL3RyYW5zZm9ybWVycy9UcmFuc2Zvcm1lcic7XHJcblxyXG5jbGFzcyBCYWJlbFRyYW5zZm9ybWVyIGV4dGVuZHMgVHJhbnNmb3JtZXIge1xyXG5cdHRyYW5zZm9ybSAoaW5wdXQpIHtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IGJhYmVsLnRyYW5zZm9ybShpbnB1dCk7XHJcblx0XHRjb25zdCBvdXRwdXQgPSByZXN1bHQuY29kZTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCYWJlbFRyYW5zZm9ybWVyO1xyXG4iLCJjbGFzcyBUcmFuc2Zvcm1lciB7XHJcblx0dHJhbnNmb3JtIChpbnB1dCkge1xyXG5cdFx0Ly8gUGFzcyB0aHJvdWdoXHJcblx0XHRyZXR1cm4gaW5wdXQ7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1lcjtcclxuIiwiaW1wb3J0IEJpbiBmcm9tICdjbGFzc2VzL0Jpbic7XHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2NsYXNzZXMvRW1pdHRlcic7XHJcbmltcG9ydCBGaWxlV2F0Y2hlciBmcm9tICdjbGFzc2VzL0ZpbGVXYXRjaGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJpbjtcclxuXHJcbmV4cG9ydCB7XHJcblx0QmluLFxyXG5cdEVtaXR0ZXIsXHJcblx0RmlsZVdhdGNoZXIsXHJcbn1cclxuXHJcbmltcG9ydCBFcnJvciBmcm9tICdjbGFzc2VzL2Vycm9ycy9FcnJvcic7XHJcbmltcG9ydCBOb3RJbXBsZW1lbnRlZEVycm9yIGZyb20gJ2NsYXNzZXMvZXJyb3JzL05vdEltcGxlbWVudGVkRXJyb3InO1xyXG5cclxuZXhwb3J0IHtcclxuXHRFcnJvcixcclxuXHROb3RJbXBsZW1lbnRlZEVycm9yLFxyXG59XHJcblxyXG5pbXBvcnQgSW5qZWN0b3IgZnJvbSAnY2xhc3Nlcy9pbmplY3RvcnMvSW5qZWN0b3InO1xyXG5pbXBvcnQgQ1NTSW5qZWN0b3IgZnJvbSAnY2xhc3Nlcy9pbmplY3RvcnMvQ1NTSW5qZWN0b3InO1xyXG5pbXBvcnQgSFRNTEluamVjdG9yIGZyb20gJ2NsYXNzZXMvaW5qZWN0b3JzL0hUTUxJbmplY3Rvcic7XHJcbmltcG9ydCBKU0luamVjdG9yIGZyb20gJ2NsYXNzZXMvaW5qZWN0b3JzL0pTSW5qZWN0b3InO1xyXG5pbXBvcnQgU2NyaXB0SW5qZWN0b3IgZnJvbSAnY2xhc3Nlcy9pbmplY3RvcnMvU2NyaXB0SW5qZWN0b3InO1xyXG5pbXBvcnQgU3R5bGVJbmplY3RvciBmcm9tICdjbGFzc2VzL2luamVjdG9ycy9TdHlsZUluamVjdG9yJztcclxuXHJcbmV4cG9ydCB7XHJcblx0SW5qZWN0b3IsXHJcblx0Q1NTSW5qZWN0b3IsXHJcblx0SFRNTEluamVjdG9yLFxyXG5cdEpTSW5qZWN0b3IsXHJcblx0U2NyaXB0SW5qZWN0b3IsXHJcblx0U3R5bGVJbmplY3RvcixcclxufVxyXG5cclxuaW1wb3J0IE91dHB1dCBmcm9tICdjbGFzc2VzL291dHB1dHMvT3V0cHV0JztcclxuaW1wb3J0IEZyYW1lT3V0cHV0IGZyb20gJ2NsYXNzZXMvb3V0cHV0cy9GcmFtZU91dHB1dCc7XHJcbmltcG9ydCBXaW5kb3dPdXRwdXQgZnJvbSAnY2xhc3Nlcy9vdXRwdXRzL1dpbmRvd091dHB1dCc7XHJcblxyXG5leHBvcnQge1xyXG5cdE91dHB1dCxcclxuXHRGcmFtZU91dHB1dCxcclxuXHRXaW5kb3dPdXRwdXQsXHJcbn1cclxuXHJcbmltcG9ydCBTb3VyY2UgZnJvbSAnY2xhc3Nlcy9zb3VyY2VzL1NvdXJjZSc7XHJcbmltcG9ydCBFZGl0b3JTb3VyY2UgZnJvbSAnY2xhc3Nlcy9zb3VyY2VzL0VkaXRvclNvdXJjZSc7XHJcbmltcG9ydCBGaWxlU291cmNlIGZyb20gJ2NsYXNzZXMvc291cmNlcy9GaWxlU291cmNlJztcclxuaW1wb3J0IExpbmtTb3VyY2UgZnJvbSAnY2xhc3Nlcy9zb3VyY2VzL0xpbmtTb3VyY2UnO1xyXG5cclxuZXhwb3J0IHtcclxuXHRTb3VyY2UsXHJcblx0RWRpdG9yU291cmNlLFxyXG5cdEZpbGVTb3VyY2UsXHJcblx0TGlua1NvdXJjZSxcclxufVxyXG5cclxuaW1wb3J0IFRyYW5zZm9ybWVyIGZyb20gJ2NsYXNzZXMvdHJhbnNmb3JtZXJzL1RyYW5zZm9ybWVyJztcclxuaW1wb3J0IEJhYmVsVHJhbnNmb3JtZXIgZnJvbSAnY2xhc3Nlcy90cmFuc2Zvcm1lcnMvQmFiZWxUcmFuc2Zvcm1lcic7XHJcblxyXG5leHBvcnQge1xyXG5cdFRyYW5zZm9ybWVyLFxyXG5cdEJhYmVsVHJhbnNmb3JtZXIsXHJcbn1cclxuIl19
