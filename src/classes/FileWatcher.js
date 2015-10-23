import Emitter from 'classes/Emitter';

const INTERVAL = Symbol('interval');
const MODIFIED = Symbol('lastModified');

class FileWatcher extends Emitter {
	constructor (file, interval = FileWatcher.DEFAULT_INTERVAL) {
		super();
		if (!(file instanceof File)) {
			throw new Error('FileWatcher must be initialized with a file to watch');
		}
		this.interval = interval;
		this.file = file;
		this[MODIFIED] = file.lastModified;
	}

	set watching (value) {
		if (value || this[INTERVAL]) {
			clearInterval(this[INTERVAL]);
		}
		if (value) {
			this[INTERVAL] = setInterval(() => this.loop(), this.interval);
		}
	}

	loop () {
		if (this.file.lastModified !== this[MODIFIED] && this.file.size > 0) {
			this.didChange();
			this[MODIFIED] = this.file.lastModified;
		}
	}

	didChange () {
		this.emit('change', this.file);
	}
}

FileWatcher.DEFAULT_INTERVAL = 100;

export default FileWatcher;
