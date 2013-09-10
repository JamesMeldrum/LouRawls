'use strict';

var LouRawls = require('../bin/LouRawls.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)

var aspectDefinition = new LouRawls.AspectDefinition({
  aspectOne : new LouRawls.Aspect( function( eventType, route, eventOptions, splatOptions, aspectMap  ){

    console.log( 'aspectOne fired' );

  }),
  aspectTwo : new LouRawls.Aspect( function(){
    
    console.log( 'aspectTwo fired' );

  })
});

var router = new LouRawls.Router({
  debug : true,
  routes : {
      '/list*': 'list',
      '/index*' : 'home',
      '/' : 'home',
  },
  events : {
    'DOMReady'  : {
      list : new LouRawls.AspectMap({
        aspects : [ 'aspectOne', 'aspectTwo' ],
        executionModel : 'sync',
        callback : function(){
          console.log( 'List CB' );
        },
        options : {
          testOptBool : true,
          testOptString : 'yolo',
          testOptNumber : 69
        }
      }),
      home : new LouRawls.AspectMap({
        aspects : [ 'aspectOne', 'aspectTwo' ],
        executionModel : 'sync',
        callback : function(){
          console.log( 'Home CB' );
        },
        options : {
          testOptBool : true,
          testOptString : 'yolo',
          testOptNumber : 69
        }
      })
    }
  },
  aspectDefinition : aspectDefinition
});

router.start(); // Bind listeners, call aspects on events

*/

exports['Router'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(LouRawls.Router, undefined, 'should be undefined.');
    test.done();
  },
};
