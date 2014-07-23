goog.provide('prestans');

/**
 * Base namespace for the prestans library.  Checks to see prestans is already
 * defined in the current scope before assigning to prevent clobbering if
 * prestans.js is loaded more than once.
 *
 * @const
 */
var prestans = prestans || {};

/**
 * Globals
 */
prestans.GLOBALS = {
    VERSION: "2.0"
};