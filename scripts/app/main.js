import Bin from 'classes/Bin';
import FrameOutput from 'classes/outputs/FrameOutput';
import WindowOutput from 'classes/outputs/WindowOutput';
import FileSource from 'classes/sources/FileSource';
import JSInjector from 'classes/injectors/JSInjector';
import BabelTransformer from 'classes/transformers/BabelTransformer';

import sources from 'app/sources';

const output = new FrameOutput('#output');

const bin = new Bin({
	output,
	sources,
});

function buildInjector (file) {
	switch (file.type) {
		case 'application/javascript': return new JSInjector();
		default: return null;
	}
}

function buildTransformer (file) {
	switch (file.type) {
		case 'application/javascript': return new BabelTransformer();
		default: return null;
	}
}

document.addEventListener('dragover', (e) => {
	e.preventDefault();
});

document.addEventListener('drop', (e) => {
	const files = Array.from(e.dataTransfer.files);
	if (files.length) {
		e.preventDefault();
	}
	files.forEach((file) => {
		const source = new FileSource(file);
		source.injector = buildInjector(file);
		source.transformer = buildTransformer(file);
		bin.registerSource(source);
		bin.resetOutput();
	});
});

const button = document.createElement('button');
button.textContent = 'Open in new window';

document.body.appendChild(button);

button.addEventListener('click', () => {
	const win = window.open('about:blank');
	const output = new WindowOutput(win);
	const bin = new Bin({
		output,
		sources,
	});
	bin.resetOutput();
	window.addEventListener('beforeunload', () => win.close());
});

bin.resetOutput();
