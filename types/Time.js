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
goog.provide('prestans.types.Time');

goog.require('goog.date.DateTime');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');

goog.require('prestans');

/**
 * @constructor
*/
prestans.types.Time = function(opt_config) {

    this.format_ = new goog.i18n.DateTimeFormat(prestans.types.Time.FORMAT);
    this.parse_ = new goog.i18n.DateTimeParse(prestans.types.Time.FORMAT);

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
    
    //Check that default is defined and not null
    if(goog.isDef(opt_config.defaultValue) && opt_config.defaultValue != null) {

        if(opt_config.defaultValue instanceof goog.date.Date) {
            this.default_ = opt_config.defaultValue;
            this.value_ = this.default_;
        }
        else if(opt_config.defaultValue == prestans.types.Time.NOW) {
            this.default_ = opt_config.defaultValue;
            this.value_ = new goog.date.DateTime();
        }
        else if(goog.isString(opt_config.defaultValue)) {
            var parsedDate_ = goog.date.fromIsoString(opt_config.defaultValue);
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
    
    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value))
            throw "provided value is not valid";
    }
};

/*
 * @const
 * @type {string}
 */
prestans.types.Time.FORMAT                  = 'HH:mm:ss';
prestans.types.Time.NOW                     = 'prestans.types.Time.NOW';
prestans.types.Time.prototype.value_        = null;
prestans.types.Time.prototype.required_     = null;
prestans.types.Time.prototype.default_      = null;
prestans.types.Time.prototype.format_       = null;
prestans.types.Time.prototype.parse_        = null;

prestans.types.Time.prototype.getValue = function() {
    return this.value_;
};

prestans.types.Time.prototype.setValue = function(value) {

    //Allow null for not required
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(this.required_ && value == null)
        return false;

    //Allow goog.date.Date
    if(value instanceof goog.date.DateTime) {
        this.value_ = value;
        return true;
    }

    //Try to parse string
    if(goog.isString(value)) {
        var parsedDate_ = new goog.date.DateTime(); 
        this.parse_.parse(value, parsedDate_);
        if(parsedDate_ == null)
            return false;
        else {
            var datetime_ = new goog.date.DateTime(0, 0, 0, parsedDate_.getHour(), parsedDate_.getMinute(), parsedDate_.getSeconds());
            this.value_ = date_;
            return true;
        }

    }

    //Unacceptable type
    return false;
};

prestans.types.Time.prototype.getJSONObject = function() {
    if(this.value_ instanceof goog.date.DateTime) {
        return this.format_.format(this.value_);
    }
    else
        return null;
};
