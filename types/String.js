//
// Copyright (c) 2014, Eternity Technologies Pty Ltd.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of Eternity Technologies nor the
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
*/
prestans.types.String = function(opt_config){

    //setup default values if config missing
    if(!goog.isDef(opt_config)) {
        opt_config = {
            required: true
        };
    }

    //required defaults to true
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;
    else
        this.required_ = true;

    if(goog.isDefAndNotNull(opt_config.defaultValue)) {
        this.default_ = opt_config.defaultValue;
        this.value_ = this.default_;
    }

    if(goog.isDefAndNotNull(opt_config.opt_maxLength))
        this.maxLength_ = opt_config.opt_maxLength;
    
    if(goog.isDefAndNotNull(opt_config.opt_minLength))
        this.minLength_ = opt_config.opt_minLength;

    if(goog.isDef(opt_config.format) && opt_config.format != null)
        this.format_ = new RegExp(opt_config.format);

    
    if(goog.isDef(opt_config.choices) && goog.isArray(opt_config.choices))
        this.choices_ = opt_config.choices;

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value))
            throw "provided value is not valid";
    }

};

prestans.types.String.prototype.value_         = null;
prestans.types.String.prototype.required_      = null;
prestans.types.String.prototype.default_       = null;
prestans.types.String.prototype.maxLength_     = null;
prestans.types.String.prototype.minLength_     = null;
prestans.types.String.prototype.format_        = null;
prestans.types.String.prototype.choices_       = null;

prestans.types.String.prototype.getValue = function() {
    return this.value_;
};

prestans.types.String.prototype.setValue = function(value) {

    //Check value is a string if required
    if(this.required_ && !goog.isString(value))
        return false;

    //Check empty string if required
    if(this.required_ && goog.isString(value) && value.length == 0)
        return false;

    //Check null is ok for not required
    if(!this.required && goog.isNull(value)) {
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
    if(this.format_ != null)
        if(value.match(this.format_) == null)
            return false;

    //Check that value is in choices
    if(this.choices_ != null) {
        if(!goog.array.contains(this.choices_, value))
            return false;
    }
    
    this.value_ = value;
    return true;

};

prestans.types.String.prototype.getMaxLength = function() {
    return this.maxLength_;
};

prestans.types.String.prototype.getMinLength = function() {
    return this.minLength_;
};

prestans.types.String.prototype.getFormat = function() {
    return this.format_;
};

prestans.types.String.prototype.getChoices = function() {
    return this.choices_;
};