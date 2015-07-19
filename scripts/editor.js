import Bin from 'classes/Bin';
import Output from 'classes/Output';
import FileSource from 'classes/sources/FileSource';
import JSInjector from 'classes/injectors/JSInjector';
import BabelTransformer from 'classes/transformers/BabelTransformer';
import EditorView from 'classes/views/EditorView';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

var KEY_JS = 'edit-js-value';
var KEY_HTML = 'edit-html-value';
var KEY_CSS = 'edit-css-value';

var output = new Output('#output');
var bin = new Bin(output);

var htmlEditorView = new EditorView({
	element: '#edit-html',
	mode: 'htmlmixed',
	storageKey: KEY_HTML,
});

bin.registerSource(htmlEditorView.source);

var jsEditorView = new EditorView({
	element: '#edit-js',
	mode: 'javascript',
	storageKey: KEY_JS,
});

bin.registerSource(jsEditorView.source);

var cssEditorView = new EditorView({
	element: '#edit-css',
	mode: 'css',
	storageKey: KEY_CSS,
});

bin.registerSource(cssEditorView.source);

document.addEventListener('dragover', function (e) {
	e.preventDefault();
});

document.addEventListener('drop', function (e) {
	var files = Array.from(e.dataTransfer.files);
	if (files.length) {
		e.preventDefault();
		files.forEach(function (file) {
			var source = new FileSource(file);
			source.injector = new JSInjector();
			source.transformer = new BabelTransformer();
			bin.registerSource(source);
			bin.resetOutput();
		});
	}
});

bin.resetOutput();
