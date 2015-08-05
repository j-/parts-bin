const FRAME = Symbol('frame');
const BLANK = 'about:blank';
const READY_LOOP_INTERVAL = 10;

class Output {
	constructor (element) {
		this.frame = element || document.createElement('iframe');
	}

	set frame (value) {
		var element = value;
		if (typeof value === 'string') {
			element = document.querySelector(value);
		}
		this[FRAME] = element;
	}

	get frame () {
		return this[FRAME];
	}

	get window () {
		return this.frame.contentWindow;
	}

	get document () {
		return this.window.document;
	}

	get head () {
		return this.document.head;
	}

	get body () {
		return this.document.body;
	}

	reset () {
		this.frame.src = BLANK;
	}

	ready (callback) {
		callback = (typeof callback === 'function') ? callback : () => {};
		let context = this;
		function loop () {
			try {
				// Both head and body elements must be present
				if (context.head && context.body) {
					callback();
					return;
				}
			}
			catch (no_op) {}
			setTimeout(loop, READY_LOOP_INTERVAL);
		}
		loop();
	}
};

export default Output;
