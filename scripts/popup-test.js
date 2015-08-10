import Source from 'classes/sources/Source';
import HTMLInjector from 'classes/injectors/HTMLInjector';
import WindowOutput from 'classes/outputs/WindowOutput';
import Bin from 'classes/Bin';

let testSource = new Source();
testSource.injector = new HTMLInjector();
testSource.getValue = function () {
	return '<title>This is the title</title><strong>Hello world</strong>';
};

let button = document.createElement('button');
button.textContent = 'Open in new window';

document.body.appendChild(button);

button.addEventListener('click', function () {
	var win = window.open('about:blank');
	var out = new WindowOutput(win);
	var bin = new Bin(out);
	bin.registerSource(testSource);
	bin.resetOutput();
});
