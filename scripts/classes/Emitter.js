const EVENTS = Symbol('events');

class Emitter {
	constructor () {
		this[EVENTS] = {};
	}

	on (events, listener) {
		events.split(/,?\s+/g).forEach((event) => {
			this[EVENTS][event] = this[EVENTS][event] || [];
			this[EVENTS][event].push(listener);
		});
		return this;
	}

	once (event, listener) {
		function callback (...args) {
			this.off(event, callback);
			listener.call(this, ...args);
		}
		callback.listener = listener;
		this.on(event, callback);
		return this;
	}

	off (event, listener) {
		let listeners = this[EVENTS][event];
		if (!listeners) {
			return this;
		}
		if (!listener) {
			this.removeAllListeners(event);
			return this;
		}
		for (let i = 0; i < listeners.length; i++) {
			let current = listeners[i];
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

	removeAllListeners (event) {
		if (event) {
			delete this[EVENTS][event];
		}
		else {
			this[EVENTS] = {};
		}
		return this;
	}

	emit (event, ...args) {
		let listeners = this[EVENTS][event];
		if (!listeners) {
			return this;
		}
		listeners.forEach((listener) => listener.call(this, ...args));
		return this;
	}
}

export default Emitter;
