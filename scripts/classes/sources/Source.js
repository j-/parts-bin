import Emitter from 'classes/Emitter';
import NotImplementedError from 'classes/errors/NotImplementedError';

class Source extends Emitter {
	addTo (output) {
		return this.getValue().then((input) => this.injector.inject(input, output));
	}

	getValue () {
		throw new NotImplementedError('Source value getter must be implemented by subclass');
	}
}

export default Source;
