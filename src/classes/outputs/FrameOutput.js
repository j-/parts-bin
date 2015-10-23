import Output from 'classes/outputs/Output';

const FRAME = Symbol('frame');
const BLANK = 'about:blank';

class FrameOutput extends Output {
	constructor (element) {
		super();
		this.frame = element || document.createElement('iframe');
	}

	set frame (value) {
		let element = value;
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
}

export default FrameOutput;
