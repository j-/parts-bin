import Injector from 'classes/injectors/Injector';

class HTMLInjector extends Injector {
	inject (input, output) {
		// Create temporary parent container
		var temp = document.createElement('div');
		temp.innerHTML = input;
		var children = temp.childNodes;
		var frag = document.createDocumentFragment();
		while (children.length) {
			frag.appendChild(children[0]);
		}
		output.body.appendChild(frag);
	}
}

export default HTMLInjector;
