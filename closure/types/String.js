//
// Copyright (c) 2012, Eternity Technologies Pty Ltd.
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

/**
 * @constructor
*/
prestans.types.String = function(opt_value, opt_required, opt_default, opt_maxLength, opt_minLength, opt_format, opt_choices) {

    //required defaults to true
    if(goog.isDef(opt_required))
        this.required_ = opt_required;
    else
        this.required_ = true;

    if(goog.isDef(opt_default)) {
        this.default_ = opt_default;
        this.value_ = this.default_;
    }
    //Set value after default has been evaluated
    if(goog.isDef(opt_value) && opt_value != null) {
        this.value_ = opt_value;
    }

    if(goog.isDef(opt_maxLength))
        this.maxLength_ = opt_maxLength;
    
    if(goog.isDef(opt_minLength))
        this.minLength_ = opt_minLength;

    if(goog.isDef(opt_format) && opt_format != null)
        this.format_ = new RegExp(opt_format);

    
    if(goog.isDef(opt_choices) && goog.isArray(opt_choices))
        this.choices_ = opt_choices;
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

    //Check max length
    if(this.maxLength_ != null && value.length > this.maxLength_)
        return false;
    
    //Check min length
    if(this.minLength_ != null && value.length < this.minLength_) {
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