import Injector from 'classes/injectors/Injector';

class HTMLInjector extends Injector {
	setup (bin, input) {
		// Create temporary parent container
		const temp = document.createElement('div');
		temp.innerHTML = input;
		const children = temp.childNodes;
		const frag = document.createDocumentFragment();
		while (children.length) {
			frag.appendChild(children[0]);
		}
		bin.output.body.appendChild(frag);
	}
}

export default HTMLInjector;
