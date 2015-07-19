import Injector from 'classes/injectors/Injector';

class CSSInjector extends Injector {
	inject (input, output) {
		var style = document.createElement('style');
		style.innerHTML = input;
		output.head.appendChild(style);
	}
}

export default CSSInjector;
