import Output from 'classes/outputs/Output';

const WINDOW = Symbol('frame');
const BLANK = 'about:blank';

class WindowOutput extends Output {
	constructor (win) {
		super();
		this.window = win;
	}

	set window (val) {
		this[WINDOW] = val;
	}

	get window () {
		return this[WINDOW];
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
		this.window.location = BLANK;
	}
};

export default WindowOutput;
