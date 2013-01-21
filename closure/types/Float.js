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
goog.provide('prestans.types.Float');

goog.require('goog.array');

/**
 * @constructor
*/
prestans.types.Float = function(opt_value, opt_required, opt_default, opt_maximum, opt_minimum, opt_choices) {

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
    if(goog.isDef(opt_value) && opt_value != null)
        this.value_ = opt_value;

    if(goog.isDef(opt_maximum))
        this.maximum_ = opt_maximum;
    
    if(goog.isDef(opt_minimum))
        this.minimum_ = opt_minimum;
    
    if(goog.isDef(opt_choices))
        this.choices_ = opt_choices;


};

prestans.types.Float.prototype.value_         = null;
prestans.types.Float.prototype.required_      = null;
prestans.types.Float.prototype.default_       = null;
prestans.types.Float.prototype.maximum_       = null;
prestans.types.Float.prototype.minimum_       = null;
prestans.types.Float.prototype.choices_       = null;

prestans.types.Float.prototype.getValue = function() {
    return this.value_;
};

prestans.types.Float.prototype.setValue = function(value) {

    //Check required
     var floatValue = parseFloat(value);
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(isNaN(floatValue))
        return false;

    //maximum
    if(this.maximum_ != null && value > this.maximum_)
        return false;

    //minium
    if(this.minimum_ != null && value < this.minimum_)
        return false;

    //Check that value is in choices
    if(this.choices_ != null) {
        if(!goog.array.contains(this.choices_, value))
            return false;
    }

    this.value_ = value;
    return true;

};

prestans.types.Float.prototype.getChoices = function() {
    return this.choices_;
};