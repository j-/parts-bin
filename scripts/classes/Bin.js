import Output from 'classes/outputs/Output';

class Bin {
	constructor (options = {}) {
		this.sources = options.sources || [];
		this.output = options.output || new Output();
		this.sources.forEach((source) => this.registerSource(source, false));
	}

	registerSource (source, push = true) {
		if (push) {
			this.sources.push(source);
		}
		source.on('change', () => this.handleSourceChange(source));
	}

	unregisterSource (source, reset = true) {
		for (let i = 0; i < this.sources.length; i++) {
			if (this.sources[i] === source) {
				this.sources.splice(i, 1);
				// TODO: Remove 'change' listener from source
				// Only remove the first instance of this source
				break;
			}
		}
		if (reset) {
			this.resetOutput();
		}
	}

	addAllSources () {
		this.sources.forEach((source) => this.addSource(source));
	}

	addSource (source) {
		return Promise.resolve(source.addTo(this));
	}

	handleSourceChange (source) {
		const requiresSetup = source.injector.teardown(this);
		if (requiresSetup) {
			this.addSource(source);
		}
	}

	resetOutput () {
		this.output.reset();
		this.output.ready(() => this.addAllSources());
	}
}

export default Bin;
