class BaseError extends Error {
	constructor (message) {
		super();
		this.message = message;
	}

	get name () {
		return this.constructor.name;
	}
}

export default BaseError;
