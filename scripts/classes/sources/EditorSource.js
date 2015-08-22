import Source from 'classes/sources/Source';

class EditorSource extends Source {
	constructor (editor) {
		super();
		this.editor = editor;
	}

	getValue () {
		return Promise.resolve(this.editor.getValue());
	}

	triggerChange () {
		this.emit('change');
	}
}

export default EditorSource;
