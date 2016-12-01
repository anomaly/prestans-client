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
goog.provide('prestans.types.Float');

goog.require('goog.array');
goog.require('prestans');

/**
 * @constructor
 * @param {!Object=} opt_config
 * @param {!boolean=} opt_raiseValidateException whether to raise exception if validate fails in constructor
 */
prestans.types.Float = function(opt_config, opt_raiseValidateException) {

    if(!goog.isDef(opt_raiseValidateException))
        opt_raiseValidateException = true;

    //setup default values if config missing
    if(!goog.isDef(opt_config)) {
        opt_config = {
            required: true
        };
    }

    /**
     * @private
     * @type {!string}
     */
    this.name_ = "Float";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * required defaults to true
     * @type {!boolean}
     * @private
     */
    this.required_ = true;
    if(goog.isDefAndNotNull(opt_config.required))
        this.required_ = opt_config.required;

    /**
     * @type {?number}
     * @private
     */
    this.default_ = null;

    /**
     * @type {?number}
     * @private
     */
    this.value_ = null;

    if(goog.isDef(opt_config.defaultValue)) {
        this.default_ = opt_config.defaultValue;
        this.value_ = this.default_;
    }

    /**
     * @type {?number}
     * @private
     */
    this.maximum_ = null;
    if(goog.isDef(opt_config.maximum))
        this.maximum_ = opt_config.maximum;

    /**
     * @type {?number}
     * @private
     */
    this.minimum_ = null;
    if(goog.isDef(opt_config.minimum))
        this.minimum_ = opt_config.minimum;

    /**
     * @type {?Array<number>}
     * @private
     */
    this.choices_ = null;
    if(goog.isDef(opt_config.choices))
        this.choices_ = opt_config.choices;

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value) && opt_raiseValidateException)
            throw this.name_+": provided value is not valid";
    }

};

/** @const {!RegExp} */
prestans.types.Float.REGEX = /^[\d]+$|\.\d+|\d+\.\d+$/;

/**
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Float.isFloat = function(value) {

    var float_ = new prestans.types.Float({
        required: true
    });

    return float_.setValue(value);
};

/**
 * @final
 *
 * @return {?number}
 */
prestans.types.Float.prototype.getValue = function() {
    return this.value_;
};

/**
 * @final
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Float.prototype.setValue = function(value) {

    //Check required
     var floatValue = parseFloat(value);
    if(!this.required_ && (goog.isNull(value) || (goog.isString(value) && value.length == 0))) {
        this.value_ = null;
        return true;
    }
    
    //stop null if required
    if(this.required_ && goog.isNull(value))
        return false;
    
    //stop empty strings
    if(this.required_ && goog.isString(value) && value.length == 0)
        return false;
    
    //stop invalid strings that might still parse (removed until fully tested)
    if(goog.isString(value)) {
        var matches_ = value.match(prestans.types.Float.REGEX);

        if(goog.isNull(matches_) || matches_.length == 0)
            return false;
    }

    //invalid float
    if(isNaN(floatValue))
        return false;

    //copy the float value across for further testing
    value = floatValue;

    //maximum
    if(goog.isDefAndNotNull(this.maximum_) && value > this.maximum_)
        return false;

    //minimum
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
 * @final
 *
 * @return {?Array<number>}
 */
prestans.types.Float.prototype.getChoices = function() {
    return this.choices_;
};