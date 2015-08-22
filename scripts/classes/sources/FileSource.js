import Source from 'classes/sources/Source';
import FileWatcher from 'classes/FileWatcher';

class FileSource extends Source {
	constructor (file) {
		super();
		if (!file) {
			throw new Error('FileSource must be initialized with file');
		}
		this.file = file;
		this.watcher = new FileWatcher(this.file);
		this.watcher.on('change', () => this.handleFileChange());
		this.watcher.watching = true;
	}

	handleFileChange () {
		this.emit('change');
	}

	getValue () {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = reject;
			reader.readAsText(this.file);
		});
	}
}

export default FileSource;
