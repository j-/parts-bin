import Injector from 'classes/injectors/Injector';

class CSSInjector extends Injector {
	setup (bin, input) {
		var style = this.style || (this.style = document.createElement('style'));
		style.innerHTML = input;
		bin.output.head.appendChild(style);
	}

	teardown (bin) {
		bin.output.head.removeChild(this.style);
		return true;
	}
}

export default CSSInjector;
