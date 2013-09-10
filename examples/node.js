var LouRawls = require( 'lourawls' );

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
