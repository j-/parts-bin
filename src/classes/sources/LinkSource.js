import Source from 'classes/sources/Source';

class LinkSource extends Source {
	constructor (uri) {
		super();
		this.uri = uri;
	}

	getValue () {
		return this.uri;
	}
}

export default LinkSource;
