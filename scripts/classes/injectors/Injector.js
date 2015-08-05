import NotImplementedError from 'classes/errors/NotImplementedError';

class Injector {
	setup () {
		throw new NotImplementedError('Injection must be implemented by subclass');
	}

	teardown (bin) {
		// Default behaviour is to reset the bin
		bin.resetOutput();
		// Return `true` if the setup needs to be explicitly called again
		return false;
	}
}

export default Injector;
