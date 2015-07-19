import View from 'classes/views/View';
import EditorSource from 'classes/sources/EditorSource';
import CodeMirror from 'codemirror';
import config from 'editor-config';

import Injector from 'classes/injectors/Injector';
import JSInjector from 'classes/injectors/JSInjector';
import HTMLInjector from 'classes/injectors/HTMLInjector';
import CSSInjector from 'classes/injectors/CSSInjector';

const MODE = Symbol('mode');

class EditorView extends View {
	constructor (...args) {
		super(...args);
		this.editor = new CodeMirror(this.element, config);
		this.editor.setOption('mode', this.mode);
		this.editor.setOption('value', this.getStorageValue());
		this.editor.setOption('extraKeys', {
			'Ctrl-Enter': () => this.triggerChange(),
			'Ctrl-R': () => this.triggerChange(),
			'Ctrl-S': () => this.triggerChange(),
			'F5': () => this.triggerChange(),
		});
		this.source = new EditorSource(this.editor);
		this.assignInjector();
	}

	set mode (value) {
		this[MODE] = value;
		if (this.editor) {
			this.editor.setOption('mode', value);
		}
		this.assignInjector();
	}

	get mode () {
		return this[MODE];
	}

	getStorageValue () {
		return localStorage.getItem(this.storageKey) || '';
	}

	updateSorageValue () {
		localStorage.setItem(this.storageKey, this.editor.getValue() || '');
	}

	triggerChange () {
		this.updateSorageValue();
		this.source.triggerChange();
	}

	assignInjector () {
		if (this.source) {
			this.source.injector = EditorView.buildInjector(this.mode);
		}
	}

	static buildInjector (mode) {
		switch (mode) {
			case 'javascript': return new JSInjector();
			case 'htmlmixed': return new HTMLInjector();
			case 'css': return new CSSInjector();
			default: return new Injector();
		}
	}
}

export default EditorView;
