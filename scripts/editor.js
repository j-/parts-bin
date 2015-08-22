import Bin from 'classes/Bin';
import FrameOutput from 'classes/outputs/FrameOutput';
import FileSource from 'classes/sources/FileSource';
import JSInjector from 'classes/injectors/JSInjector';
import BabelTransformer from 'classes/transformers/BabelTransformer';
import EditorView from 'classes/views/EditorView';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

const KEY_JS = 'edit-js-value';
const KEY_HTML = 'edit-html-value';
const KEY_CSS = 'edit-css-value';

const output = new FrameOutput('#output');
const bin = new Bin(output);

const htmlEditorView = new EditorView({
	element: '#edit-html',
	mode: 'htmlmixed',
	storageKey: KEY_HTML,
});

bin.registerSource(htmlEditorView.source);

const jsEditorView = new EditorView({
	element: '#edit-js',
	mode: 'javascript',
	storageKey: KEY_JS,
});

bin.registerSource(jsEditorView.source);

const cssEditorView = new EditorView({
	element: '#edit-css',
	mode: 'css',
	storageKey: KEY_CSS,
});

bin.registerSource(cssEditorView.source);

document.addEventListener('dragover', function (e) {
	e.preventDefault();
});

document.addEventListener('drop', function (e) {
	const files = Array.from(e.dataTransfer.files);
	if (files.length) {
		e.preventDefault();
		files.forEach(function (file) {
			const source = new FileSource(file);
			source.injector = new JSInjector();
			source.transformer = new BabelTransformer();
			bin.registerSource(source);
			bin.resetOutput();
		});
	}
});

bin.resetOutput();
