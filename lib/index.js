/*
 *
 * Example syntax for a client
 *
 * Runs in head
 *
 */

'use strict';

var LouRawls = require( './LouRawls' );

var aspectDefinition = new LouRawls.AspectDefinition({
  aspectOne : new LouRawls.Aspect( function(){

    console.log( 'aspectOne fired' );

  }),
  aspectTwo : new LouRawls.Aspect( function(){
    
    console.log( 'aspectTwo fired' );

  })
});

var router = new LouRawls.Router({
  routes : {
      '/list*': 'list',
      '/index*' : 'home',
  },
  events : {
    'DOMReady'  : {
      list : new LouRawls.AspectMap({
        aspects : [ 'aspectOne', 'aspectTwo' ],
        executionModel : 'synch',
        callback : function(){
          console.log( 'List CB' );
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

debugger;
router.start(); // Bind listeners, call aspects on events
