import Injector from 'classes/injectors/Injector';

class ScriptInjector extends Injector {
	setup (bin, input) {
		var script = document.createElement('script');
		script.src = input;
		output.head.appendChild(script);
	}
}

export default ScriptInjector;
