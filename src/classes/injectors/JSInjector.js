import Injector from 'classes/injectors/Injector';

class JSInjector extends Injector {
	setup (bin, input) {
		const script = document.createElement('script');
		script.innerHTML = input;
		bin.output.head.appendChild(script);
	}
}

export default JSInjector;
