Parts bin
=========

[![Build Status][travis-svg]][travis-link]

An attempt at creating a generic sandbox solution for showcasing and modifying
HTML, CSS and JavaScript.

The idea is to build a pared-down JS Bin which can be dropped into documentation
pages. It will run actual code while allowing the user to manipulate and
experiment with that code.

## Installing

```bash
$ npm install --global jspm
$ jspm init
```

## Running

This project currently contains a simple demo app. To avoid violating the cross-
origin request policy, it must be served over a simple HTTP server. I prefer
using [serve][serve]:

```bash
$ npm install --global serve
$ serve
```

The app is now available at [http://localhost:3000/](http://localhost:3000/).

## Classes

### Sources

Sources define where code comes from. Each source can be from user input, the
current system or external systems. They are the individual inputs for each bin.

#### [EditorSource](scripts/classes/sources/EditorSource.js)

Initialized with a reference to a [CodeMirror][codemirror] instance, gets the
user input content as text.

#### [FileSource](scripts/classes/sources/FileSource.js)

Reads from a [File][file] handle and emits 'change' events when the file is
modified on the host file system. Useful for file `input`s or for drag-and-drop.

#### [LinkSource](scripts/classes/sources/LinkSource.js)

Simple string value source. Describes a URI.

### Injectors

The injector's job is simply to take a given input and apply it to a given
output.

#### [CSSInjector](scripts/classes/injectors/CSSInjector.js)

Takes an input value and injects it via a `style` tag. The input will be raw
CSS.

#### [HTMLInjector](scripts/classes/injectors/HTMLInjector.js)

Builds a document fragment out of the given HTML. Appends all nodes to the
output's body.

#### [JSInjector](scripts/classes/injectors/JSInjector.js)

Takes an input value and injects it via a `script` tag. The input will be raw
JavaScript.

#### [ScriptInjector](scripts/classes/injectors/ScriptInjector.js)

Takes an input URI and sets it as the `src` for a new `script` tag. Then appends
this new script node to the output's head.

#### [StyleInjector](scripts/classes/injectors/StyleInjector.js)

Takes an input URI and sets it as the `href` for a new stylesheet `link`. Then
appends this new link node to the output's head.

### Transformers

Transformers take an input and convert it into another syntax. Useful for
precompiled languages.

#### [BabelTransformer](scripts/classes/transformers/BabelTransformer.js)

Uses [Babel][babel] to translate ES6 into ES5 for use in current browsers.

### Outputs

Documents to inject code into.

#### [FrameOutput](scripts/classes/outputs/FrameOutput.js)

Builds a `frame` element and enables manipulation of that frame's DOM.

#### [WindowOutput](scripts/classes/outputs/WindowOutput.js)

Takes a reference to a `window` element and enables manipulation of that
window's DOM. Handy when creating new windows via `window.open(...)`.

[travis-svg]: https://travis-ci.org/j-/parts-bin.svg
[travis-link]: https://travis-ci.org/j-/parts-bin
[serve]: https://github.com/tj/serve
[codemirror]: https://codemirror.net/
[file]: https://developer.mozilla.org/en-US/docs/Web/API/File
[babel]: https://babeljs.io/
