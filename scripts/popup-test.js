import Source from 'classes/sources/Source';
import HTMLInjector from 'classes/injectors/HTMLInjector';
import WindowOutput from 'classes/outputs/WindowOutput';
import Bin from 'classes/Bin';

const testSource = new Source();
testSource.injector = new HTMLInjector();
testSource.getValue = function () {
	return '<title>This is the title</title><strong>Hello world</strong>';
};

const button = document.createElement('button');
button.textContent = 'Open in new window';

document.body.appendChild(button);

button.addEventListener('click', function () {
	const win = window.open('about:blank');
	const out = new WindowOutput(win);
	const bin = new Bin(out);
	bin.registerSource(testSource);
	bin.resetOutput();
	window.addEventListener('beforeunload', () => win.close());
});
