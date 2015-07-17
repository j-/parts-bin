/* global ace */

import bin from 'bin';

var KEY_JS = 'edit-js-value';
var KEY_HTML = 'edit-html-value';
var KEY_CSS = 'edit-css-value';

var editJS = ace.edit('edit-js');
editJS.getSession().setMode('ace/mode/javascript');
editJS.setValue(localStorage.getItem(KEY_JS) || '');
editJS.selection.clearSelection();

var editHTML = ace.edit('edit-html');
editHTML.getSession().setMode('ace/mode/html');
editHTML.setValue(localStorage.getItem(KEY_HTML) || '');
editHTML.selection.clearSelection();

var editCSS = ace.edit('edit-css');
editCSS.getSession().setMode('ace/mode/css');
editCSS.setValue(localStorage.getItem(KEY_CSS) || '');
editCSS.selection.clearSelection();

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

var config = {
	name: 'execute',
	bindKey: {
		win: 'Ctrl-Enter',
		mac: 'Command-Enter'
	},
	exec: execute,
	readOnly: false
};

editJS.commands.addCommand(config);
editHTML.commands.addCommand(config);
editCSS.commands.addCommand(config);

execute();
