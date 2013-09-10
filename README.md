# LouRawls

Event router for light-weight JS projects based on AOP.

For too long have my designers come to me asking for a lightweight framework for
putting together designs. LouRawls aims to be the bridge between design and a
full implementation. It's light-weight enough to quickly spin up new pages and
the javascript is implemented using AOP so it's as modular as it gets, built on
a router than mocks MVC.

For now, there's a hard dependency on jekyll. In the future I look to replace
this with a node-based solution that implemented via grunt, allowing for hooks
into less, sass and templates.

## Getting Started
- Install the module with: `npm install LouRawls`
- Create the Aspect, Router and Routes
- Call start on a router instance
- For bonus points, look for an implementation in index.html, list.html,
  lib/index.js

## Documentation

### In The Browser

Include /bin/index.js before referencing it in the browser, LouRawls will be available in the
global n/s.

If using within a Node environment, it will be treated as an NPM package.

Also see the examples folder for more implementation details.

## Examples
see /examples for more

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
4/9/2013 - 0.0.1 - Development version.
  * Added Initial object implementations and commentary
  * Added Browserify support
  * Added splat routing
9/9/2013 - 0.0.2 - Development version.
  * Added Browser (Global) and Node bindings
  * Fixed bug in development version
  * Added debug mode
  * Added multiple router triggers
  * Added Documentation

## License
Copyright (c) 2013 James Meldrum  
Licensed under the MIT license.

## TODO
* Expand documentation
* Integrate into Jekyll and rebrand as "YO DAWG, I HEARD YOU LIKED SCRIPTING
  LANGUAGES SO I PUT A SCRIPTING LANGUAGE IN YOUR SCRIPTING LANGUAGE".
