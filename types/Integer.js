//
// Copyright (c) 2015, Anomaly Software Pty Ltd.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of Anomaly Software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL ETERNITY TECHNOLOGIES BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
goog.provide('prestans.types.Integer');

goog.require('goog.array');
goog.require('goog.string.format');
goog.require('prestans');

/**
 * @constructor
 * @param {!Object=} opt_config
 */
prestans.types.Integer = function(opt_config) {

    //setup a blank config if one was missing
    if(!goog.isDefAndNotNull(opt_config))
        opt_config = {};

    /**
     * @private
     * @type {!string}
     */
    this.name_ = "Integer";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * @private
     * @type {!boolean}
     */
    this.required_ = true;
    if(goog.isDefAndNotNull(opt_config.required))
        this.required_ = opt_config.required;

    /**
     * @private
     * @type {?number}
     */
    this.value_ = null;

    /**
     * @private
     * @type {?number}
     */
    this.default_ = null;

    if(goog.isDef(opt_config.defaultValue)) {
        this.default_ = opt_config.defaultValue;
        this.value_ = this.default_;
    }

    /**
     * @private
     * @type {?number}
     */
    this.maximum_ = null;
    if(goog.isDef(opt_config.maximum))
        this.maximum_ = opt_config.maximum;

    /**
     * @private
     * @type {?number}
     */
    this.minimum_ = null;    
    if(goog.isDef(opt_config.minimum))
        this.minimum_ = opt_config.minimum;
    
    /**
     * @private
     * @type {?Array<number>}
     */
    this.choices_ = null;
    if(goog.isDef(opt_config.choices))
        this.choices_ = opt_config.choices;

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value))
            throw goog.string.format("%s: provided value: %i is not valid", this.name_, opt_config.value);
    }
};

/** @const {!RegExp} */
prestans.types.Integer.REGEX = /^[-+]?\d+$/;

/** @const {!number} */
prestans.types.Integer.MAX_SIGNED_INT = 2147483647;

/** @const {!number} */
prestans.types.Integer.MIN_SAFE_INTEGER = -9007199254740991;

/** @const {!number} */
prestans.types.Integer.MAX_SAFE_INTEGER = 9007199254740991;



/**
 * @param {*} value
 * 
 * @return {!boolean}
 */
prestans.types.Integer.isInteger = function(value) {

    var integer_ = new prestans.types.Integer({
        required: true
    });

    return integer_.setValue(value);
};

/**
 * @param {number} value
 * 
 * @return {!boolean}
 */
prestans.types.Integer.isSafeInteger = function(value) {

    //check is a safe integer
    if(goog.isDef(Number.isSafeInteger))
        return Number.isSafeInteger(value);
    else {
        return (typeof value === 'number') &&
               (value % 1 === 0) &&
               value >= prestans.types.Integer.MIN_SAFE_INTEGER &&
               value <= prestans.types.Integer.MAX_SAFE_INTEGER;
    }
};

/**
 * @param {?number} value
 *
 * @return {!boolean}
 */
prestans.types.Integer.isBitwiseSafe = function(value) {

    if(goog.isNull(value))
        return false;

    //check that value falls within signed integer range (to avoid bit-shift problems in javascript)
    if(value > prestans.types.Integer.MAX_SIGNED_INT || value < -prestans.types.Integer.MAX_SIGNED_INT)
        return false;
    else
        return true;
};

/**
 * @return {?number}
 */
prestans.types.Integer.prototype.getValue = function() {
    return this.value_;
};

/**
 * @return {!boolean}
 */
prestans.types.Integer.prototype.isBitwiseSafe = function() {
    return prestans.types.Integer.isBitwiseSafe(this.value_);
};

/**
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Integer.prototype.setValue = function(value) {

    //Check required
     var intValue = parseInt(value, 10);
    if(!this.required_ && (goog.isNull(value) || value.length == 0)) {
        this.value_ = null;
        return true;
    }

    //stop null if required
    if(this.required_ && goog.isNull(value))
        return false;

    //stop empty strings
    if(this.required_ && goog.isString(value) && value.length == 0)
        return false;

    //stop invalid strings that might still parse
    if(goog.isString(value)) {
        var matches_ = value.match(prestans.types.Integer.REGEX);

        if(matches_ == null || matches_.length == 0)
            return false;
    }

    //invalid integer
    if(isNaN(intValue))
        return false;

    //check that value is not a float
    if(goog.isNumber(value) && !(value % 1 === 0))
        return false;

    //check that the value is an integer
    //disabled as this limits the usable range of integers too much because it uses bit-shifting
    //if(goog.isNumber(value) && !(value === +value && value === (value|0)))
    //    return false;

    //check that value is a safe integer
    if(!prestans.types.Integer.isSafeInteger(intValue))
        return false;

    //copy the integer value across for further testing
    value = intValue;

    //maximum
    if(goog.isDefAndNotNull(this.maximum_) && value > this.maximum_)
        return false;

    //minium
    if(goog.isDefAndNotNull(this.minimum_) && value < this.minimum_)
        return false;

    //Check that value is in choices
    if(goog.isDefAndNotNull(this.choices_)) {
        if(!goog.array.contains(this.choices_, value))
            return false;
    }

    this.value_ = value;
    return true;

};

/**
 * @return {?Array<number>}
 */
prestans.types.Integer.prototype.getChoices = function() {
    return this.choices_;
};