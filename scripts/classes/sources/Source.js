import Emitter from 'classes/Emitter';
import NotImplementedError from 'classes/errors/NotImplementedError';

class Source extends Emitter {
	addTo (output) {
		return Promise.resolve(this.getValue())
			.then((value) => this.transform(value))
			.then((input) => this.injector.inject(input, output));
	}

	getValue () {
		throw new NotImplementedError('Source value getter must be implemented by subclass');
	}

	transform (input) {
		if (this.transformer) {
			return this.transformer.transform(input);
		}
		return input;
	}
}

export default Source;
