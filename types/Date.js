//
// Copyright (c) 2013, Eternity Technologies Pty Ltd.
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
goog.provide('prestans.types.Date');

goog.require('goog.date.Date');

/**
 * @constructor
*/
prestans.types.Date = function(opt_value, opt_required, opt_default) {

    //required defaults to true
    if(goog.isDef(opt_required))
        this.required_ = opt_required;
    else
        this.required_ = true;

    //Check that default is defined and not null
    if(goog.isDef(opt_default) && opt_default != null) {

        if(opt_default instanceof goog.date.Date) {
            this.default_ = opt_default;
            this.value_ = this.default_;
        }
        else if(opt_default == prestans.types.Date.TODAY) {
            this.default_ = opt_default;
            this.value_ = new goog.date.Date();
        }
        else if(goog.isString(opt_default)) {
            var parsedDate_ = goog.date.fromIsoString(opt_default);
            if(parsedDate_ == null)
                throw "Default date string incorrect format";
            else {
                var date_ = new goog.date.Date(parsedDate_.getFullYear(), parsedDate_.getMonth(), parsedDate_.getDate());

                this.default_ = date_;
                this.value_ = date_;
            }
        }
        else
            throw "Default must be of acceptable type";
    }

    //Set value after default has been evaluated
    if(goog.isDef(opt_value) && opt_value != null) {
        var valid_ = this.setValue(opt_value);
        if(!valid_)
            throw "Incorrect type for DateTime";
    }
};

prestans.types.Date.TODAY                   = 'prestans.types.Date.TODAY';
prestans.types.Date.prototype.value_        = null;
prestans.types.Date.prototype.required_     = null;
prestans.types.Date.prototype.default_      = null;
prestans.types.Date.prototype.format_       = null;

prestans.types.Date.prototype.getValue = function() {
    return this.value_;
};

prestans.types.Date.prototype.setValue = function(value) {

    //Allow null for not required
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(this.required_ && value == null)
        return false;

    //Allow goog.date.Date
    if(value instanceof goog.date.Date) {
        this.value_ = value;
        return true;
    }

    //Try to parse string
    if(goog.isString(value)) {
        var parsedDate_ = goog.date.fromIsoString(value);   
        if(parsedDate_ == null)
            return false;
        else {
            var date_ = new goog.date.Date(parsedDate_.getFullYear(), parsedDate_.getMonth(), parsedDate_.getDate());
            this.value_ = date_;
            return true;
        }

    }

    //Unacceptable type
    return false;
};

prestans.types.Date.prototype.getJSONObject = function() {

    if(this.value_ instanceof goog.date.Date) {
        var date_ = new goog.date.Date(this.value_.getFullYear(), this.value_.getMonth(), this.value_.getDate());
        return date_.toIsoString(true);
    }
    else
        return null;
};