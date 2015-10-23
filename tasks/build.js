var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');

var pathRoot = path.resolve(__dirname, '../src');
var pathInput = path.resolve(pathRoot, 'parts-bin.js');
var pathOutput = path.resolve(__dirname, '../dist/parts-bin.js');

var output = fs.createWriteStream(pathOutput);

var config = {
	entries: pathInput,
	paths: pathRoot,
	debug: true,
	standalone: 'PartsBin',
};

browserify(config)
	.transform(babelify)
	.bundle()
	.on('error', function (err) {
		console.error(err.message);
		process.exit(1);
	})
	.pipe(output);
