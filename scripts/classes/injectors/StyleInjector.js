import Injector from 'classes/injectors/Injector';

class StyleInjector extends Injector {
	setup (bin, input) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = input;
		bin.output.head.appendChild(link);
	}

	// TODO: Add teardown method
}

export default StyleInjector;
