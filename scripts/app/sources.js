import EditorView from 'classes/views/EditorView';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';

const KEY_JS = 'edit-js-value';
const KEY_HTML = 'edit-html-value';
const KEY_CSS = 'edit-css-value';

export const htmlEditorView = new EditorView({
	element: '#edit-html',
	mode: 'htmlmixed',
	storageKey: KEY_HTML,
});

export const jsEditorView = new EditorView({
	element: '#edit-js',
	mode: 'javascript',
	storageKey: KEY_JS,
});

export const cssEditorView = new EditorView({
	element: '#edit-css',
	mode: 'css',
	storageKey: KEY_CSS,
});

export default [
	htmlEditorView.source,
	jsEditorView.source,
	cssEditorView.source,
];
