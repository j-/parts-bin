import NotImplementedError from 'classes/errors/NotImplementedError';

class Injector {
	inject () {
		throw new NotImplementedError('Injection must be implemented by subclass');
	}
}

export default Injector;
