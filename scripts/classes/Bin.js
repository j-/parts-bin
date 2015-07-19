import Output from 'classes/Output';

class Bin {
	constructor (output) {
		this.sources = [];
		this.output = output || new Output();
	}

	registerSource (source) {
		this.sources.push(source);
		source.on('change', () => this.resetOutput());
	}

	unregisterSource (source) {
		for (let i = 0; i < this.sources.length; i++) {
			if (sources[i] === source) {
				this.sources.splice(i, 1);
				source.off('change', this.resetOutput);
				// Only remove the first instance of this source
				break;
			}
		}
	}

	addAllSources () {
		this.sources.forEach((source) => this.addSource(source));
	}

	addSource (source) {
		source.addTo(this.output);
	}

	resetOutput () {
		this.output.reset();
		this.output.ready(() => this.addAllSources());
	}
}

export default Bin;
