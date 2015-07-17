import bin from 'bin';
import CodeMirror from 'codemirror';
import config from 'editor-config';

import 'npm:codemirror@5.4.0/mode/javascript/javascript';
import 'npm:codemirror@5.4.0/mode/css/css';
import 'npm:codemirror@5.4.0/mode/htmlmixed/htmlmixed';

var KEY_JS = 'edit-js-value';
var KEY_HTML = 'edit-html-value';
var KEY_CSS = 'edit-css-value';

var common = Object.assign({
	extraKeys: {
		'Ctrl-Enter': execute
	}
}, config);

var editJS = CodeMirror(document.getElementById('edit-js'), Object.assign({
	value: localStorage.getItem(KEY_JS) || '',
	mode: 'javascript'
}, common));

var editHTML = CodeMirror(document.getElementById('edit-html'), Object.assign({
	value: localStorage.getItem(KEY_HTML) || '',
	mode: 'htmlmixed'
}, common));

var editCSS = CodeMirror(document.getElementById('edit-css'), Object.assign({
	value: localStorage.getItem(KEY_CSS) || '',
	mode: 'css'
}, common));

function execute () {
	var js = editJS.getValue();
	var html = editHTML.getValue();
	var css = editCSS.getValue();
	localStorage.setItem(KEY_JS, js);
	localStorage.setItem(KEY_HTML, html);
	localStorage.setItem(KEY_CSS, css);
	bin.reload(function () {
		bin.loadHTML(html);
		bin.loadCSS(css);
		// Execute in next loop to clear call stack
		setTimeout(bin.loadJavaScript, 0, js);
	});
}

execute();
