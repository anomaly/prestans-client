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
goog.provide('prestans.types.String');

goog.require('goog.array');

goog.require('prestans');

/**
 * @constructor
 * @param {!Object=} opt_config
 * @param {!boolean=} opt_raiseValidateException whether to raise exception if validate fails in constructor
 */
prestans.types.String = function(opt_config, opt_raiseValidateException) {

    if(!goog.isDef(opt_raiseValidateException))
        opt_raiseValidateException = true;

    //setup default config if missing
    if(!goog.isDef(opt_config))
        opt_config = {};

    /**
     * @private
     * @type {?string}
     */
    this.value_ = null;

    /**
     * @private
     * @type {!string}
     */
    this.name_ = "String";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * @private
     * @type {!boolean}
     */
    this.required_ = true;
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;

    /**
     * @private
     * @type {!boolean}
     */
    this.trim_ = true;
    if(goog.isDef(opt_config.trim))
        this.trim_ = opt_config.trim;
        

    /**
     * @private
     * @type {?string}
     */
    this.default_ = null;
    if(goog.isDefAndNotNull(opt_config.defaultValue)) {
        this.default_ = opt_config.defaultValue;
        this.value_ = this.default_;
    }

    /**
     * @private
     * @type {?number}
     */
    this.maxLength_ = null;
    if(goog.isDefAndNotNull(opt_config.opt_maxLength))
        this.maxLength_ = opt_config.opt_maxLength;
    
    /**
     * @private
     * @type {?number}
     */
    this.minLength_ = null;
    if(goog.isDefAndNotNull(opt_config.opt_minLength))
        this.minLength_ = opt_config.opt_minLength;

    /**
     * @private
     * @type {?RegExp}
     */
    this.format_ = null;
    if(goog.isDefAndNotNull(opt_config.format))
        this.format_ = new RegExp(opt_config.format);

    /**
     * @private
     * @type {?Array<!string>}
     */
    this.choices_ = null;
    if(goog.isDef(opt_config.choices) && goog.isArray(opt_config.choices))
        this.choices_ = opt_config.choices;

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value) && opt_raiseValidateException)
            throw this.name_+": provided value is not valid "+opt_config.value;
    }

};

/**
 * @return {?string}
 */
prestans.types.String.prototype.getValue = function() {
    return this.value_;
};

/**
 * @param {?} value
 * 
 * @return {!boolean}
 */
prestans.types.String.prototype.setValue = function(value) {

    //perform a trim
    if(this.trim_ && goog.isString(value) && value.length > 0)
        value = value.trim();

    //Convert empty string to null
    if(goog.isString(value) && value.length == 0)
        value = null;

    //Check value is a string if required
    if(this.required_ && !goog.isString(value)) {
    //if(this.required_ && !(typeof value == 'string')) {
        return false;
    }

    //Check null is ok for not required
    if(!this.required_ && goog.isNull(value)) {
        this.value_ = value;
        return true;
    }

    //Check max length
    if(goog.isDefAndNotNull(this.maxLength_) && value.length > this.maxLength_)
        return false;
    
    //Check min length
    if(goog.isDefAndNotNull(this.minLength_) && value.length < this.minLength_) {
        return false;
    }

    //Check format
    if(this.format_ instanceof RegExp)
        if(value.match(this.format_) == null)
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
 * @return {?number}
 */
prestans.types.String.prototype.getMaxLength = function() {
    return this.maxLength_;
};

/**
 * @return {?number}
 */
prestans.types.String.prototype.getMinLength = function() {
    return this.minLength_;
};

/**
 * @return {?RegExp}
 */
prestans.types.String.prototype.getFormat = function() {
    return this.format_;
};

/**
 * @return {?Array<!string>}
 */
prestans.types.String.prototype.getChoices = function() {
    return this.choices_;
};