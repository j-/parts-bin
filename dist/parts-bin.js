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

},{"classes/outputs/Output":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"classes/errors/Error":2}],4:[function(require,module,exports){
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

},{"classes/errors/NotImplementedError":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classesBin = require('classes/Bin');

var _classesBin2 = _interopRequireDefault(_classesBin);

exports['default'] = _classesBin2['default'];
module.exports = exports['default'];

},{"classes/Bin":1}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkOi9Qcm9qZWN0cy9iaW4vc3JjL2NsYXNzZXMvQmluLmpzIiwiZDovUHJvamVjdHMvYmluL3NyYy9jbGFzc2VzL2Vycm9ycy9FcnJvci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9lcnJvcnMvTm90SW1wbGVtZW50ZWRFcnJvci5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvY2xhc3Nlcy9vdXRwdXRzL091dHB1dC5qcyIsImQ6L1Byb2plY3RzL2Jpbi9zcmMvcGFydHMtYmluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O29DQ0FtQix3QkFBd0I7Ozs7SUFFckMsR0FBRztBQUNJLFVBRFAsR0FBRyxHQUNtQjs7O01BQWQsT0FBTyx5REFBRyxFQUFFOzt3QkFEcEIsR0FBRzs7QUFFUCxNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3JDLE1BQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSx1Q0FBWSxDQUFDO0FBQzdDLE1BQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtVQUFLLE1BQUssY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7R0FBQSxDQUFDLENBQUM7RUFDckU7O2NBTEksR0FBRzs7U0FPTyx3QkFBQyxNQUFNLEVBQWU7OztPQUFiLElBQUkseURBQUcsSUFBSTs7QUFDbEMsT0FBSSxJQUFJLEVBQUU7QUFDVCxRQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQjtBQUNELFNBQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1dBQU0sT0FBSyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7SUFBQSxDQUFDLENBQUM7R0FDM0Q7OztTQUVnQiwwQkFBQyxNQUFN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QUFJLEVBQUU7QUFDM0IsY0FBUSxFQUFFLENBQUM7QUFDWCxhQUFPO01BQ1A7S0FDRCxDQUNELE9BQU8sR0FBRyxFQUFFOztLQUVYO0FBQ0QsY0FBVSxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7QUFDRixPQUFJLEVBQUUsQ0FBQztHQUNQOzs7T0FwQ1UsZUFBRztBQUNiLFNBQU0sa0RBQXdCLGlEQUFpRCxDQUFDLENBQUM7R0FDakY7OztPQUVZLGVBQUc7QUFDZixTQUFNLGtEQUF3QixtREFBbUQsQ0FBQyxDQUFDO0dBQ25GOzs7T0FFUSxlQUFHO0FBQ1gsU0FBTSxrREFBd0IsK0NBQStDLENBQUMsQ0FBQztHQUMvRTs7O09BRVEsZUFBRztBQUNYLFNBQU0sa0RBQXdCLCtDQUErQyxDQUFDLENBQUM7R0FDL0U7OztRQWZJLE1BQU07OztxQkF3Q0csTUFBTTs7Ozs7Ozs7Ozs7OzBCQzVDTCxhQUFhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBPdXRwdXQgZnJvbSAnY2xhc3Nlcy9vdXRwdXRzL091dHB1dCc7XG5cbmNsYXNzIEJpbiB7XG5cdGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcblx0XHR0aGlzLnNvdXJjZXMgPSBvcHRpb25zLnNvdXJjZXMgfHwgW107XG5cdFx0dGhpcy5vdXRwdXQgPSBvcHRpb25zLm91dHB1dCB8fCBuZXcgT3V0cHV0KCk7XG5cdFx0dGhpcy5zb3VyY2VzLmZvckVhY2goKHNvdXJjZSkgPT4gdGhpcy5yZWdpc3RlclNvdXJjZShzb3VyY2UsIGZhbHNlKSk7XG5cdH1cblxuXHRyZWdpc3RlclNvdXJjZSAoc291cmNlLCBwdXNoID0gdHJ1ZSkge1xuXHRcdGlmIChwdXNoKSB7XG5cdFx0XHR0aGlzLnNvdXJjZXMucHVzaChzb3VyY2UpO1xuXHRcdH1cblx0XHRzb3VyY2Uub24oJ2NoYW5nZScsICgpID0+IHRoaXMuaGFuZGxlU291cmNlQ2hhbmdlKHNvdXJjZSkpO1xuXHR9XG5cblx0dW5yZWdpc3RlclNvdXJjZSAoc291cmNlLCByZXNldCA9IHRydWUpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc291cmNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHRoaXMuc291cmNlc1tpXSA9PT0gc291cmNlKSB7XG5cdFx0XHRcdHRoaXMuc291cmNlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdC8vIFRPRE86IFJlbW92ZSAnY2hhbmdlJyBsaXN0ZW5lciBmcm9tIHNvdXJjZVxuXHRcdFx0XHQvLyBPbmx5IHJlbW92ZSB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgdGhpcyBzb3VyY2Vcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChyZXNldCkge1xuXHRcdFx0dGhpcy5yZXNldE91dHB1dCgpO1xuXHRcdH1cblx0fVxuXG5cdGFkZEFsbFNvdXJjZXMgKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoYWNjZXB0LCByZWplY3QpID0+IHtcblx0XHRcdGxldCBjaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0dGhpcy5zb3VyY2VzLmZvckVhY2goKHNvdXJjZSkgPT4ge1xuXHRcdFx0XHRjaGFpbiA9IGNoYWluXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4gdGhpcy5hZGRTb3VyY2Uoc291cmNlKSlcblx0XHRcdFx0XHQuY2F0Y2gocmVqZWN0KTtcblx0XHRcdH0pO1xuXHRcdFx0Y2hhaW4udGhlbihhY2NlcHQpO1xuXHRcdH0pO1xuXHR9XG5cblx0YWRkU291cmNlIChzb3VyY2UpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNvdXJjZS5hZGRUbyh0aGlzKSk7XG5cdH1cblxuXHRoYW5kbGVTb3VyY2VDaGFuZ2UgKHNvdXJjZSkge1xuXHRcdGNvbnN0IHJlcXVpcmVzU2V0dXAgPSBzb3VyY2UuaW5qZWN0b3IudGVhcmRvd24odGhpcyk7XG5cdFx0aWYgKHJlcXVpcmVzU2V0dXApIHtcblx0XHRcdHRoaXMuYWRkU291cmNlKHNvdXJjZSk7XG5cdFx0fVxuXHR9XG5cblx0cmVzZXRPdXRwdXQgKCkge1xuXHRcdHRoaXMub3V0cHV0LnJlc2V0KCk7XG5cdFx0cmV0dXJuIHRoaXMub3V0cHV0LnJlYWR5KCgpID0+IHRoaXMuYWRkQWxsU291cmNlcygpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBCaW47XG4iLCJjbGFzcyBCYXNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcblx0Y29uc3RydWN0b3IgKG1lc3NhZ2UpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdH1cclxuXHJcblx0Z2V0IG5hbWUgKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhc2VFcnJvcjtcclxuIiwiaW1wb3J0IEVycm9yIGZyb20gJ2NsYXNzZXMvZXJyb3JzL0Vycm9yJztcblxuY2xhc3MgTm90SW1wbGVtZW50ZWRFcnJvciBleHRlbmRzIEVycm9yIHtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBOb3RJbXBsZW1lbnRlZEVycm9yO1xuIiwiaW1wb3J0IE5vdEltcGxlbWVudGVkRXJyb3IgZnJvbSAnY2xhc3Nlcy9lcnJvcnMvTm90SW1wbGVtZW50ZWRFcnJvcic7XG5cbmNvbnN0IFJFQURZX0xPT1BfSU5URVJWQUwgPSAxMDtcblxuY2xhc3MgT3V0cHV0IHtcblx0Z2V0IHdpbmRvdyAoKSB7XG5cdFx0dGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoJ2B3aW5kb3dgIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XG5cdH1cblxuXHRnZXQgZG9jdW1lbnQgKCkge1xuXHRcdHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKCdgZG9jdW1lbnRgIGdldHRlciBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzJyk7XG5cdH1cblxuXHRnZXQgaGVhZCAoKSB7XG5cdFx0dGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoJ2BoZWFkYCBnZXR0ZXIgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpO1xuXHR9XG5cblx0Z2V0IGJvZHkgKCkge1xuXHRcdHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEVycm9yKCdgYm9keWAgZ2V0dGVyIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MnKTtcblx0fVxuXG5cdHJlc2V0ICgpIHtcblx0XHR0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcignYHJlc2V0YCBtZXRob2QgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcycpO1xuXHR9XG5cblx0cmVhZHkgKGNhbGxiYWNrKSB7XG5cdFx0Y2FsbGJhY2sgPSAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSA/IGNhbGxiYWNrIDogKCkgPT4ge307XG5cdFx0Y29uc3QgbG9vcCA9ICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIEJvdGggaGVhZCBhbmQgYm9keSBlbGVtZW50cyBtdXN0IGJlIHByZXNlbnRcblx0XHRcdFx0aWYgKHRoaXMuaGVhZCAmJiB0aGlzLmJvZHkpIHtcblx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGVycikge1xuXHRcdFx0XHQvLyBOby1vcFxuXHRcdFx0fVxuXHRcdFx0c2V0VGltZW91dChsb29wLCBSRUFEWV9MT09QX0lOVEVSVkFMKTtcblx0XHR9O1xuXHRcdGxvb3AoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBPdXRwdXQ7XG4iLCJpbXBvcnQgQmluIGZyb20gJ2NsYXNzZXMvQmluJztcclxuZXhwb3J0IGRlZmF1bHQgQmluO1xyXG4iXX0=
