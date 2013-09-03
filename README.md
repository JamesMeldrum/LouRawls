# LouRawls

Event router for light-weight JS projects based on AOP.

Currently in active development. 
Currently NOT seeking users. 
Currently PASSING unit tests.

## Getting Started
- Install the module with: `npm install LouRawls`
- Create the Aspect, Router and Routes
```javascript
var LouRawls = require('LouRawls');
var AspectDefinition = LouRawls.Aspect.extend({ // TODO: This needs to be called AspectDefinition
var AspectDefinition = new LouRawls.AspectDefinition({ // TODO: This needs to be called AspectDefinition
    aspectOne   : new LouRawls.Aspect(function(){
      // Aspect functionality
      // Can be passed arguments from the router, function interfaces
      //  dont do argument checking, up to the aspect implementer
    }),
    aspectTwo   : function(){},
    aspectThree : function(){}
});

var Router = LouRawls.Router.extend({

  routes : {
    // Format
    // Preserving STUPID backbone syntax
    'list*' : 'list'
    '' : 'home'
    '*actions' : 'home'

  },

  events : {
    'DOMReady' : { // Event - string
      list : new LouRawls.AspectMap({
        aspects : ['aspectOne','aspectTwo',aspectThree'], // Aspects the route is subscribed to in order
        executionModel : 'synch' || 'asynch',
        callback : undefined // To be called when all events finish
        options : {} // Hash of options passed to the aspects
      })
    }
  },
  aspect : AspectDefinition // Pass the aspect object along

});

// Instaniate new router
// Routing table taken as args
  // Takes 'routes', key being hash of events supported
    // Hash of events are themselves hashes of aspects
    


// The Aspect Routes Events to Aspects

var Aspect = new LouRawls.Aspect({
  DOMLoaded : new Aspect   
});


var router = new Router();
router.start();
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 James Meldrum  
Licensed under the MIT license.
