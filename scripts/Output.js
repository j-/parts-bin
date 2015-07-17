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

	injectHTML (content) {
		// Create temporary parent container
		var temp = document.createElement('div');
		temp.innerHTML = content;
		var children = temp.childNodes;
		var frag = document.createDocumentFragment();
		while (children.length) {
			frag.appendChild(children[0]);
		}
		this.body.appendChild(frag);
	}

	injectJS (content) {
		var script = document.createElement('script');
		script.innerHTML = content;
		this.head.appendChild(script);
	}

	injectCSS (content) {
		var style = document.createElement('style');
		style.innerHTML = content;
		this.head.appendChild(style);
	}

	linkJS (content) {
		var script = document.createElement('script');
		script.src = content;
		this.head.appendChild(script);
	}

	linkCSS (content) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = content;
		this.head.appendChild(link);
	}
};

export default Output;
