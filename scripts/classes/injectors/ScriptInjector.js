import Injector from 'classes/injectors/Injector';

class ScriptInjector extends Injector {
	setup (bin, input) {
		const script = document.createElement('script');
		script.src = input;
		bin.output.head.appendChild(script);
	}
}

export default ScriptInjector;
