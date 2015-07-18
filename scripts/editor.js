import Output from 'classes/output';
import CodeMirror from 'codemirror';
import config from 'editor-config';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

var KEY_JS = 'edit-js-value';
var KEY_HTML = 'edit-html-value';
var KEY_CSS = 'edit-css-value';

var output = new Output('#output');

var common = Object.assign({
	extraKeys: {
		'Ctrl-Enter': execute,
		'Ctrl-R': execute,
		'F5': execute,
	}
}, config);

var configJS = Object.assign({
	value: localStorage.getItem(KEY_JS) || '',
	mode: 'javascript',
}, common);
var editJS = CodeMirror(document.getElementById('edit-js'), configJS);

var configHTML = Object.assign({
	value: localStorage.getItem(KEY_HTML) || '',
	mode: 'htmlmixed',
}, common);
var editHTML = CodeMirror(document.getElementById('edit-html'), configHTML);

var configCSS = Object.assign({
	value: localStorage.getItem(KEY_CSS) || '',
	mode: 'css',
}, common);
var editCSS = CodeMirror(document.getElementById('edit-css'), configCSS);

function execute () {
	var js = editJS.getValue();
	var html = editHTML.getValue();
	var css = editCSS.getValue();
	localStorage.setItem(KEY_JS, js);
	localStorage.setItem(KEY_HTML, html);
	localStorage.setItem(KEY_CSS, css);
	output.reset();
	output.ready(function () {
		output.injectHTML(html);
		output.injectCSS(css);
		// Execute in next loop to clear call stack
		setTimeout(() => output.injectJS(js), 0);
	});
}

execute();
