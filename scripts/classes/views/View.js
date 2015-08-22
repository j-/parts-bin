import Emitter from 'classes/Emitter';

const ELEMENT = Symbol('element');

class View extends Emitter {
	constructor (...args) {
		super();
		Object.assign(this, ...args);
	}

	set element (value) {
		let element = value;
		if (typeof value === 'string') {
			element = document.querySelector(value);
		}
		this[ELEMENT] = element;
	}

	get element () {
		let element = this[ELEMENT];
		if (!element) {
			element = document.createElement('div');
			this[ELEMENT] = element;
		}
		return element;
	}
}

export default View;
