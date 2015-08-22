import Output from 'classes/outputs/Output';

class Bin {
	constructor (output) {
		this.sources = [];
		this.output = output || new Output();
	}

	registerSource (source) {
		this.sources.push(source);
		source.on('change', () => this.handleSourceChange(source));
	}

	unregisterSource (source) {
		for (let i = 0; i < this.sources.length; i++) {
			if (this.sources[i] === source) {
				this.sources.splice(i, 1);
				// TODO: Remove 'change' listener from source
				// Only remove the first instance of this source
				break;
			}
		}
	}

	addAllSources () {
		this.sources.forEach((source) => this.addSource(source));
	}

	addSource (source) {
		source.addTo(this);
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
