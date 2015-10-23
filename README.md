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
$ bower install j-/parts-bin
```

## Classes

### Sources

Sources define where code comes from. Each source can be from user input, the
current system or external systems. They are the individual inputs for each bin.

#### [EditorSource](src/classes/sources/EditorSource.js)

Initialized with a reference to a [CodeMirror][codemirror] instance, gets the
user input content as text.

#### [FileSource](src/classes/sources/FileSource.js)

Reads from a [File][file] handle and emits 'change' events when the file is
modified on the host file system. Useful for file `input`s or for drag-and-drop.

#### [LinkSource](src/classes/sources/LinkSource.js)

Simple string value source. Describes a URI.

### Injectors

The injector's job is simply to take a given input and apply it to a given
output.

#### [CSSInjector](src/classes/injectors/CSSInjector.js)

Takes an input value and injects it via a `style` tag. The input will be raw
CSS.

#### [HTMLInjector](src/classes/injectors/HTMLInjector.js)

Builds a document fragment out of the given HTML. Appends all nodes to the
output's body.

#### [JSInjector](src/classes/injectors/JSInjector.js)

Takes an input value and injects it via a `script` tag. The input will be raw
JavaScript.

#### [ScriptInjector](src/classes/injectors/ScriptInjector.js)

Takes an input URI and sets it as the `src` for a new `script` tag. Then appends
this new script node to the output's head.

#### [StyleInjector](src/classes/injectors/StyleInjector.js)

Takes an input URI and sets it as the `href` for a new stylesheet `link`. Then
appends this new link node to the output's head.

### Transformers

Transformers take an input and convert it into another syntax. Useful for
precompiled languages.

#### [BabelTransformer](src/classes/transformers/BabelTransformer.js)

Uses [Babel][babel] to translate ES6 into ES5 for use in current browsers.

### Outputs

Documents to inject code into.

#### [FrameOutput](src/classes/outputs/FrameOutput.js)

Builds a `frame` element and enables manipulation of that frame's DOM.

#### [WindowOutput](src/classes/outputs/WindowOutput.js)

Takes a reference to a `window` element and enables manipulation of that
window's DOM. Handy when creating new windows via `window.open(...)`.

[travis-svg]: https://travis-ci.org/j-/parts-bin.svg
[travis-link]: https://travis-ci.org/j-/parts-bin
[codemirror]: https://codemirror.net/
[file]: https://developer.mozilla.org/en-US/docs/Web/API/File
[babel]: https://babeljs.io/
