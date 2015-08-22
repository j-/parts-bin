import Injector from 'classes/injectors/Injector';

class ScriptInjector extends Injector {
	setup (bin, input) {
		const script = document.createElement('script');
		script.src = input;
		this.output.head.appendChild(script);
	}
}

export default ScriptInjector;
