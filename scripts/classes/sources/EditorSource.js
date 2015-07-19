import Source from 'classes/sources/Source';

class EditorSource extends Source {
	constructor (editor) {
		super();
		this.editor = editor;
	}

	getValue () {
		return new Promise((resolve) => resolve(this.editor.getValue()));
	}

	triggerChange () {
		this.emit('change');
	}
}

export default EditorSource;
