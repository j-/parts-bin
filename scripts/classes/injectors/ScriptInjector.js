import Injector from 'classes/injectors/Injector';

class ScriptInjector extends Injector {
	setup (bin, input) {
		return new Promise((accept, reject) => {
			const script = document.createElement('script');
			script.src = input;
			script.addEventListener('load', () => accept(script));
			script.addEventListener('error', () => reject(new Error('Could not load script')));
			bin.output.head.appendChild(script);
		});
	}
}

export default ScriptInjector;
