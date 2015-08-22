import Injector from 'classes/injectors/Injector';

class CSSInjector extends Injector {
	setup (bin, input) {
		const style = document.createElement('style');
		style.innerHTML = input;
		bin.output.head.appendChild(style);
	}

	// TODO: Add teardown method
}

export default CSSInjector;
