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
goog.provide('prestans.types.Integer');

goog.require('goog.array');

/**
 * @constructor
*/
prestans.types.Integer = function(opt_config) {

    //setup default values if config missing
    if(!goog.isDef(opt_config)) {
        opt_config = {
            required: true
        };
    }

    //required
    if(goog.isDefAndNotNull(opt_config.required))
        this.required_ = opt_config.required;
    else
        this.required_ = false;

    //default
    if(goog.isDef(opt_config.defaultValue)) {
        this.default_ = opt_config.defaultValue;
        this.value_ = this.default_;
    }

    if(goog.isDef(opt_config.maximum))
        this.maximum_ = opt_config.maximum;
    
    if(goog.isDef(opt_config.minimum))
        this.minimum_ = opt_config.minimum;
    
    if(goog.isDef(opt_config.choices))
        this.choices_ = opt_config.choices;

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value))
            throw "provided value is not valid";
    }
        


};

prestans.types.Integer.REGEX                    = /^[-+]?\d+$/;

prestans.types.Integer.prototype.value_         = null;
prestans.types.Integer.prototype.required_      = null;
prestans.types.Integer.prototype.default_       = null;
prestans.types.Integer.prototype.maximum_       = null;
prestans.types.Integer.prototype.minimum_       = null;
prestans.types.Integer.prototype.choices_       = null;

prestans.types.Integer.prototype.getValue = function() {
    return this.value_;
};

prestans.types.Integer.prototype.setValue = function(value) {

    //Check required
     var intValue = parseInt(value, 10);
    if(!this.required_ && (goog.isNull(value) || value.length == 0)) {
        this.value_ = null;
        return true;
    }

    //stop null if required
    if(this.required && goog.isNull(value))
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

    //check that the value is an integer
    if(goog.isNumber(value) && !(value === +value && value === (value|0)))
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
    if(this.choices_ != null) {
        if(!goog.array.contains(this.choices_, value))
            return false;
    }

    this.value_ = value;
    return true;

};

prestans.types.Integer.prototype.getChoices = function() {
    return this.choices_;
};