import Injector from 'classes/injectors/Injector';

class StyleInjector extends Injector {
	setup (bin, input) {
		var link = this.link || (this.link = document.createElement('link'));
		link.rel = 'stylesheet';
		link.href = input;
		bin.output.head.appendChild(link);
	}

	teardown (bin) {
		bin.output.head.removeChild(this.link);
		return true;
	}
}

export default StyleInjector;
