/**
 *
 * Example syntax for a client
 *
 * Runs in head - needs to intercept events. Will eventually be deleted once
 *                the project is stable.
 *
 * @deprecated
 *
 */

'use strict';

var LouRawls = require( './LouRawls' ).LouRawls;

window.LouRawls = LouRawls;
exports.LouRawls = LouRawls;
