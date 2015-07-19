import Injector from 'classes/injectors/Injector';

class StyleInjector extends Injector {
	inject (input, output) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = input;
		output.head.appendChild(link);
	}
}

export default StyleInjector;
