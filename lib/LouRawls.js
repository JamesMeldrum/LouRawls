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

//var Backbone  = require( 'backbone' ),
  var $         = require( 'jquery' );
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
  this.aspect = Arguments.aspectDefinition;

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
  _.each( this._events, function( val, key, list ){

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

    routes = this.getMatchingRoutes( route, pathname );

    _.each( routes, function( route ){

      this.execRoute( route );

    }.bind( this ));


  } else {
  
    throw 'Unhandled Event Exception: ' + eventType;

  }

};


/**
 *
 *  subscribe - register all events
 *
 *  @private
 *
 */
Router.prototype.subscribe = function(){


  // Load

  _.each( this._events, function( val, key, list ){


    console.log( val, key, list );
    switch( val ){

      case 'Load':
        $( window ).load( function(){
          this.publish( val );
        }.bind( this ));
        console.log( 'load bound' );
        break;
      case 'DOMReady':
        $( 'document' ).ready( function(){
          this.publish( val );
        }.bind( this ));
        console.log( 'document bound' );
        break;
      default:
        $( this ).on( val, function(){
          this.publish( val );
        }.bind( this ));
        console.log( 'extra event' );
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
 */

Router.prototype.getMatchingRoutes = function( eventType, pathname ){

  _.each( this.routes, function( val, key, list ){

    if( this.prototype.isRoute( key, pathname )){

    }

  }.bind( this ));

};

/**
 * isRoute - Returns whether the splat is a route for the given pathname
 */

Router.prototype.isRoute( splat, pathname ){

  var routeRE = this.splatToRE( splat );

};

/**
 * splatToRE - Given a splat, returns its RE

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
 * subscribed to should be executed 'synch' or 'asynch'
 * @param Arguments.callback {function} - Callback to be made after all
 * functions have finished
 * @param Arguments.options {Object} - Options to be passed to the aspects
 *
 * @callback Arguments.callback
 *
 */

var AspectMap = function( Arguments ){

  this.aspects = Arguments.aspects;
  this.executionModel = Arguments.executionModel || 'synch';
  this.callback = Arguments.callback;
  this.options = Arguments.options;

};

exports.AspectMap = AspectMap;
