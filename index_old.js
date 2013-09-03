/**
 *  
 *  Site-Wide JavaScript - application-specific
 *
 *  @author James Meldrum
 *
 *  The functionality for each page type is stored
 *  in a hash of functions to be called by the router.
 *
 *  Frequent use of AOP
 *  http://en.wikipedia.org/wiki/Aspect-oriented_programming
 *  and Event-Based Programming
 *  http://en.wikipedia.org/wiki/Event-driven_programming
 *
 *  Methodology is that prior to DOMReady, the aspects a route 
 *  is subscribed to will subscribe to page events
 *
 *
 *  Events
 *
 *  - DOMReady: fires all subscribed members when the DOM is available for
 *  manipulation
 *
 *  - Load: fires once all elements ( including images and iframes ) have been
 *  loaded
 *
 *  Aspects
 *
 *    common - functions required for all aspects
 *    home - remaining aspects correspond to site sections
 *    top100 
 *    videos
 *    photos
 *    reveal
 *
 */

(function(){

  "use strict";

  /**
   *
   * Aspects - Array of Events and the Aspect functions required
   *
   */
  // Aspects[event]

  var Aspects = [
    {
      'DOMReady': {

        'common' : function(){

          //console.log( 'AspectDefinition::DOMReady::common' );

          // Profile Comments
          // Disqus
          //var disqus_shortname = 'kg41';
          //(function() {
          //  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          //  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          //  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
          //})();

          //// The Top 100 List
          //// Table Sort
          //// Requires: tablesorter.js
          //// http://tablesorter.com/docs
          //$("#list .table").tablesorter({
          //  headers: {
          //    5: { sorter: false }
          //  }
          //});

          //// The Top 100 List
          //// Select all boxes for PWL
          //$('#select-all').click(function (event) {
          //  var selected = this.checked;
          //  $(':checkbox').each(function () {this.checked = selected;});
          //});

          //// Share Photos
          //// Requires: masonry.js
          //// http://masonry.desandro.com
          //var container = document.querySelector('#container');
          //var msnry = new Masonry( container, {
          //  itemSelector: '.item',
          //  gutter: 10
          //});

          //// FitVids
          //// Requires: fitvids.js
          //// https://github.com/davatron5000/FitVids.js
          ////$("#relatedcontent").fitVids();

          //// Home (Countdown Clock)
          //// Requires: jquery.lwtCountdown-1.0.js
          //// http://www.littlewebthings.com/projects/countdown/index.php
        
        },

        'home' : function(){

          $( '#countdown_dashboard' ).countDown({
            targetDate: {
              'day':    12,
              'month':  11,
              'year':   2013,
              'hour':   11,
              'min':    0,
              'sec':    0
            }, omitWeeks: true
          });
        
        },

        'reveal' : function(){
        
          //console.log( 'AspectDefinition::DOMReady::reveal' );

        },
        'top100' : function(){},
        'videos' : function(){},
        'photos' : function(){}

      }

    },
    {
      'Load' : {
        'common' : function(){
          
          //console.log( 'AspectDefinition::Load::common' );

        },
      }
    }
  ];

  /**
   *
   *  Router - Subscribes to routing events in the application
   *
   *  @param {string} splat - splat to run against URL. not PCRE-complian
   *  @param {Array} aspects - Array of aspects the Route is subscribed to
   *
   */

  var Route = function( splat, aspects ){

    this.splat = splat;
    this.aspects = aspects;
    // TODO: Generate these events - read keys from AspectDefinitions
    this.subscribedEvents = {
      'DOMReady'  : {},
      'Load'      : {}
    };

  }; 

  Route.prototype.publish = function( event ){

    //console.log( 'Route::publish('+event+')' );

   // debugger;
    _.each( this.subscribedEvents[ event ], function( subscribedAspect ){

     // debugger;
      subscribedAspect();
    
    }.bind( this ));

  };

  /**
   *
   *  subscribe - make Route instance aware of events to listen for
   *
   *  @param aspectsDefinitions - External Aspect definition Object
   *
   */

  Route.prototype.subscribe = function( aspectsDefinitions ){

    // For each aspect a Route instance is listening to
    _.each( this.aspects, function( aspect ){
      //debugger;

      // Foreach Event Type in the Aspects Definition
      _.each( aspectsDefinitions, function( aspectDefinition ){

        //debugger;

        // Reference the aspect function
        _.each( _.keys( aspectDefinition ), function( eventType){

          if( typeof aspectDefinition[ eventType ][ aspect ] !== 'undefined' ){

            this.subscribedEvents[ eventType ][ aspect ] = aspectDefinition[ eventType ][ aspect ];

          }
          //debugger;
        
        }.bind( this ));


      }.bind( this ));

    }.bind( this ));
  
  };


  /**
   *
   * Router - Object that transaltes Routes to Aspects
   * 
   * Creates routing table
   * Prepares Router instance for route method
   *
   */
  
  var Router = function(){
  
    var tempRoutingTable = [];
    this.routingTable = [
      [ '/reveal' , [ 'reveal', 'common' ] ],
      [ '*' , [ 'home', 'common' ] ]
    ];

    this.routed = {
      'DOMReady': {
      },
      'Load' : {
      }
    };

    // Route table definition syntax ugly when forcing client
    // programmer to use Route Object syntax

    _.each( this.routingTable, function( val, key, list ){

      var route = new Route( val[ 0 ], val[ 1 ] );
      tempRoutingTable.push( route );
    
    });

    this.routingTable = tempRoutingTable;

  };

  /**
   *
   *  match - returns whether a splat matches a path
   *
   *  @static
   *  @private
   *  @param {string} path 
   *  @param {string} splat
   *
   *  @returns {Boolean} match - Indicates a match
   */

  Router.prototype.match = function( path, splat){

    var match = false;

    // Currently does not support splat finds
    if( _.contains( splat, '*') ){

      match = false;
    
    } else {
    
      if( this.sanitizePath( path ) === splat ){

        match = true;

      }

    }

    return match;

  };

  /**
   *
   *  sanitizePath - removes file extensions from matches
   *
   *  @static
   *  @private
   *  @param {string} unsanitizedPath - path to match against
   *
   *  @return {string } sanitizedPath - a sanitized splat
   */

  Router.prototype.sanitizePath = function( unsanitizedPath ){
  
    var sanitizedPath = unsanitizedPath.split( '.' );
    
    if( sanitizedPath.length != 1 ){

      sanitizedPath.pop();
      sanitizedPath.join('');
    
    }

    sanitizedPath = sanitizedPath[0];

    return sanitizedPath;

  };

  /**
   *
   *  publish - notifies subscribed Routes of Events
   *
   *  @private
   *  @param {string} event
   */

  Router.prototype.publish = function( event, pathname ){

    _.each( this.routingTable, function( route, key, list ){

      if( _.contains( _.keys( route.subscribedEvents ), event ) && this.match( pathname, route.splat ) ){
      
        route.publish( event );

      }

    }.bind( this ));

  };

  /**
   *
   *  route - Subscribes matched routes in the routing table to 
   *
   *  @param {string} path - window.location.pathname 
   */

  Router.prototype.route = function( path ){

    _.each( this.routingTable, function( route, key, list ){

      if( typeof route.splat !== 'undefined' && 
          this.match( path, route.splat )
      ){

        route.subscribe( Aspects );
        //debugger;

      }

    }.bind( this ));

  };

  var siteAspect = {
    
    'common' : function(){

      // Profile Comments
      // Disqus
      var disqus_shortname = 'kg41';
      (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();

      // The Top 100 List
      // Table Sort
      // Requires: tablesorter.js
      // http://tablesorter.com/docs
      $("#list .table").tablesorter({
        headers: {
          5: { sorter: false }
        }
      });

      // The Top 100 List
      // Select all boxes for PWL
      $('#select-all').click(function (event) {
        var selected = this.checked;
        $(':checkbox').each(function () {this.checked = selected;});
      });

      // Share Photos
      // Requires: masonry.js
      // http://masonry.desandro.com
      var container = document.querySelector('#container');
      var msnry = new Masonry( container, {
        itemSelector: '.item',
        gutter: 10
      });

    },

    'home' : function(){

      $( '#countdown_dashboard' ).countDown({

        // Home (Countdown Clock)
        // Requires: jquery.lwtCountdown-1.0.js
        // http://www.littlewebthings.com/projects/countdown/index.php
        targetDate: {
          'day':    12,
          'month':  11,
          'year':   2013,
          'hour':   11,
          'min':    0,
          'sec':    0
        }, omitWeeks: true
      });
    
    },

    'reveal' : function(){

    /*
     *
     *  Loads revealed images based on what's available on the server
     *
     */

      this.loadReveals = function(){

        $( 'div.wineReveal' ).each( function( ndx, el ){

          var wineRevealSpot = $( el ).attr( 'data-wineRevealId' );

          $.ajax({
            url       : 'http://localhost:4000/img/spot' + wineRevealSpot + '.png',
            complete  : function( data, status, jqXHR ){

              // In
              $( el ).find( 'img' ).attr( 'src','http://localhost:4000/img/spot' + wineRevealSpot + '.png' ) ;
              //debugger;

            },
            error     : function( jqXHR, textStatus, errorThrown ){
              //debugger;
            }
          });

        });

      };

    },
    'top100' : function(){},
    'videos' : function(){},
    'photos' : function(){}

  };

  /*
   *
   *  Two application entry points.
   *
   *
   */

  // DOMReady
  var router = new Router();
  router.route( window.location.pathname );

  $( document ).ready( function(){

    //console.log( 'Router::publish(DOMREady' );
    router.publish( 'DOMReady', window.location.pathname );
  
  }.bind( this ));

  // Load
  $( window ).load( function(){

    //console.log( 'Router::publish(Load)' );
    router.publish( 'Load', window.location.pathname );
  
  }.bind( this ));

}());

