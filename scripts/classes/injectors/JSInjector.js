import Injector from 'classes/injectors/Injector';

class JSInjector extends Injector {
	inject (input, output) {
		var script = document.createElement('script');
		script.innerHTML = input;
		output.head.appendChild(script);
	}
}

export default JSInjector;
