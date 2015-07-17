var bin = {};

bin.frame = document.getElementById('bin');
bin.window = bin.frame.contentWindow;

bin.reload = function reload (execute) {
	bin.window.location.reload();
	// Set immediate
	setTimeout(execute, 0);
};

bin.loadContent = function loadContent (content) {
	if (!content) return;
	var type = content.type;
	// Dereference content
	content = content.content;
	switch (type) {
		case 'html': return bin.loadHTML(content);
		case 'css': return bin.loadCSS(content);
		case 'js': return bin.loadJavaScript(content);
	}
};

bin.loadHTML = function loadHTML (content) {
	// Create temporary parent container
	var temp = document.createElement('div');
	temp.innerHTML = content;
	var children = temp.childNodes;
	var frag = document.createDocumentFragment();
	while (children.length) {
		frag.appendChild(children[0]);
	}
	bin.window.document.body.appendChild(frag);
};

bin.loadCSS = function loadCSS (content) {
	var style = document.createElement('style');
	style.innerHTML = content;
	bin.window.document.head.appendChild(style);
};

bin.loadJavaScript = function loadJavaScript (content) {
	var script = document.createElement('script');
	script.innerHTML = content;
	bin.window.document.head.appendChild(script);
};

export default bin;
