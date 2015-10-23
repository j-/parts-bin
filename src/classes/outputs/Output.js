import NotImplementedError from 'classes/errors/NotImplementedError';

const READY_LOOP_INTERVAL = 10;

class Output {
	get window () {
		throw new NotImplementedError('`window` getter must be implemented by subclass');
	}

	get document () {
		throw new NotImplementedError('`document` getter must be implemented by subclass');
	}

	get head () {
		throw new NotImplementedError('`head` getter must be implemented by subclass');
	}

	get body () {
		throw new NotImplementedError('`body` getter must be implemented by subclass');
	}

	reset () {
		throw new NotImplementedError('`reset` method must be implemented by subclass');
	}

	ready (callback) {
		callback = (typeof callback === 'function') ? callback : () => {};
		const loop = () => {
			try {
				// Both head and body elements must be present
				if (this.head && this.body) {
					callback();
					return;
				}
			}
			catch (err) {
				// No-op
			}
			setTimeout(loop, READY_LOOP_INTERVAL);
		};
		loop();
	}
}

export default Output;
