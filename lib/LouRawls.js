/**
 * LouRawls
 * https://github.com/JamesMeldrum/LouRawls
 *
 * Copyright (c) 2013 James Meldrum
 * Licensed under the MIT license.
 *
 * @author James Meldrum
 *
 *  Frequent use of AOP
 *  http://en.wikipedia.org/wiki/Aspect-oriented_programming
 *  and Event-Based Programming
 *  http://en.wikipedia.org/wiki/Event-driven_programming
 *
 *  Methodology is that prior to DOMReady, the aspects a route 
 *  is subscribed to will subscribe to page events
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
 *  - User defined families of events that fire asynchronously
 *
 */

'use strict';

  var $         = require( 'jquery-browserify' );
  var   _         = require( 'underscore' );

/**
 *
 *  Router - maps URL's to Aspects. Handles splats, passes variables to the
 *          object's children 
 *
 *  @public
 *  @constructor
 *
 *  @param Arguments {Object} - Arguments passed to Router
 *  @param Arguments.routes {Object} - Key/Val splat/domain paths
 *  @param Arguments.events {Object} - Event objects mapping domains to
 *                                      AspectMaps
 *  @param Arguments.aspectDefinition {LouRawls.AspectDefinition} - Collection 
 *
 */

var Router = function( Arguments ){

  this._events = ['DOMReady','Load'];

  this.routes = Arguments.routes || {};
  this.events = Arguments.events || {};
  this.aspectDefinition = Arguments.aspectDefinition;

  // Build supported events

  _.each( _.keys( this.events ), function( val ){

    if( !_.contains( this._events, val ) ){
    
      this._events.push( val.toString() );

    }

  }.bind( this ));

};

/**
 * start - bind up registered events
 *
 * @public
 *
 */

Router.prototype.start = function(){

  // Bind up AspectMaps to Events
  _.each( this._events, function( val ){

    this._events[ val ] = this.events[ val ];

  }.bind( this ));

  this.subscribe();

};

/**
 *
 *  publish - callback for each listening event
 *
 *  @public
 *
 *  @param eventType {String} - Event sub ID
 *
 */
Router.prototype.publish = function( eventType ){

  var routes = [],
      pathname = window.location.pathname;

  if( _.contains( this._events, eventType ) ){

    routes = this.getMatchingRoutes( eventType, pathname );

    if( routes.length >= 1 ){
    
      _.each( routes, function( route ){

        this.advise({
          route: route,
          eventType : eventType,
          events : this.events,
          aspectDefinition : this.aspectDefinition
        });

      }.bind( this ));

    } else {
    
      throw 'Unhandled Route Exception: ' + this.routes;

    }

  } else {
  
    throw 'Unhandled Event Exception: ' + eventType;

  }

};

/*
 *
 */

Router.prototype.execRoute = function(){};


/**
 *
 *  subscribe - register all events
 *
 *  @private
 *
 */
Router.prototype.subscribe = function(){


  // Load

  _.each( this._events, function( val ){

    //console.log( val, key, list );
    switch( val ){

      case 'Load':
        $( window ).load( function(){
          this.publish( val );
        }.bind( this ));
        //console.log( 'load bound' );
        break;
      case 'DOMReady':
        $( 'document' ).ready( function(){
          this.publish( val );
        }.bind( this ));
        //console.log( 'document bound' );
        break;
      default:
        $( this ).on( val, function(){
          this.publish( val );
        }.bind( this ));
        //console.log( 'extra event' );
        break;

    }

  }.bind( this ));

};

/**
 *
 * getMatchingRoutes - Returns array of Route Objects
 *                     that match the current route
 *                     and the eventType
 *
 *  @private
 *  @param pathname {String} URL at event publication
 *  @param eventType {String} EventType passed
 *  @returns matchingRoutes {Array} Array of Route Objects
 */

Router.prototype.getMatchingRoutes = function( eventType, pathname ){

  var matchingRoutes = [];

  _.each( this.routes, function( val, key ){

    if( this.isRoute( key, pathname )){

      matchingRoutes.push( val );

    }

  }.bind( this ));

  return matchingRoutes;

};

/**
 * isRoute - Returns whether the splat is a route for the given pathname
 *
 * @private
 * @param splat {String} Splat to match aginst
 * @param pathname {String} window.location.pathname
 *
 * @returns rc {Boolean} Whether the splat for a given pathname is a match
 */

Router.prototype.isRoute = function( splat, pathname ){

  var routeRE = this.splatToRE( splat ),
      sanitizedPathname = pathname, // ignore leading /
      rc = false;

  if( sanitizedPathname.match( routeRE )){ // RE Match over pathname
    rc = true;
  }

  return rc;

};

/**
 * splatToRE - Given a splat, returns its RE
 *
 * @private
 * @param splat - splat 
 * @returns RE {RegExp} Regular Expression matching the splat
 *
 */

Router.prototype.splatToRE = function( splat ){

  var optionalParam = /\((.*?)\)/g;
  var namedParam = /(\(\?)?:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  var splatReplace = '*';


  splat = splat.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
  }).replace(splatParam, '(.*?)').replace( splatReplace, '.*' );

  return new RegExp('^' + splat + '$');

};

/**
 *
 * extractParameters - extracts parameters from the pathname object
 *
 *  @todo change interface names
 *
 *  @private
 *  @param route {RegExp} RegExp route
 *  @param fragment {String} window.location.pathname
 *
 */

Router.prototype.extractParameters = function( route ) {

  var fragment = this.splatToRE( route );

  var params = fragment.exec(route).slice(1);
  return _.map(params, function(param) {
      return param ? decodeURIComponent(param) : null;
  });
};

/**
 *
 * advise - Advise the DOM of its aspects
 *
 * @private
 * @param Arguments {Object} Arguments
 * @param Arguments.route {String} Route joint point
 * @param Arguments.events {Object} Events Mapping to Aspects
 * @param Arguments.eventType {String} EventType that triggered the advise
 * @param Arguments.aspectDefinition Map of aspect implementations
 *
 * @todo splatOptions {Object} Options provided from the splat
 *
 */

Router.prototype.advise = function( Arguments ){

  var splatOptions = this.extractParameters( Arguments.route ), aspectMap;

  try {

    aspectMap = Arguments.events[ Arguments.eventType ][ Arguments.route ];

  } catch( e ){

    aspectMap = undefined;

  }

  if( typeof aspectMap === 'undefined' ){

    // NoOp

  } else if( aspectMap.isSync() ){

    (function adviseSynchronously( aspectMap ){
      
      _.each( aspectMap.aspects, function( aspect ){

        Arguments.aspectDefinition.aspects[ aspect ].aspectFunction.call( window, Arguments.eventType, Arguments.route, aspectMap.options, splatOptions, aspectMap ); // Calling the aspect on the global obj

      });

      if( typeof aspectMap.callback !== 'undefined' ){
      
        aspectMap.callback();

      }

    }( aspectMap ));
  
  } else {

    // Sync

    console.log( 'TODO: Execute async' );

  }

};

exports.Router = Router;
/**
 *
 * AspectDefinition - Collection of Aspects
 *
 * @public
 * @constructor
 *
 * @param aspects {Object} - Hash of aspects
 *
 */

exports.AspectDefinition = function( aspects ){

  this.aspects = aspects;

};

/**
 *
 * Aspect - Series of transforms to perform on a shared
 *          object.
 *
 *  @public
 *  @constructor
 *
 *  @param aspectFunction - Function to evaluate on calling the Aspect
 *
 */

exports.Aspect = function( aspectFunction ){

  this.aspectFunction = aspectFunction;

};

/**
 *
 * AspectMap - Maps events to AspectGroups
 *
 * @public
 * @constructor
 *
 * @param Arguments {Object} - Arguments passed to AspectMap
 * @param Arguments.aspects {Array} - Array of Aspects the Route is subscribed
 * to for an event
 * @param Arguments.executionModel {String} - Whether the aspects the route is
 * subscribed to should be executed 'sync' or 'async'
 * @param Arguments.callback {function} - Callback to be made after all
 * functions have finished
 * @param Arguments.options {Object} - Options to be passed to the aspects
 *
 * @callback Arguments.callback
 *
 */

var AspectMap = function( Arguments ){

  this.aspects = Arguments.aspects;
  this.executionModel = Arguments.executionModel || 'sync';
  this.callback = Arguments.callback;
  this.options = Arguments.options || {};

};

/**
 *
 * isSync - Whether the aspect is to be advised synchronously
 *
 * @private
 * @returns isSync {Boolean} Whether the aspect is to be advised synchronously
 *
 */

AspectMap.prototype.isSync = function(){

  return this.executionModel === 'sync';

};

exports.AspectMap = AspectMap;
