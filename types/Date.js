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
goog.provide('prestans.types.Date');

goog.require('goog.date.Date');

goog.require('prestans');

/**
 * @constructor
 * @param {Object=} opt_config
 */
prestans.types.Date = function(opt_config) {

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
    this.name_ = "Date";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * required defaults to true
     * @private
     * @type {!boolean}
     */
    this.required_ = true;
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;

    /**
     * @type {?goog.date.Date}
     * @private
     */
    this.value_ = null;

    //Check that default is defined and not null
    if(goog.isDef(opt_config.defaultValue) && opt_config.defaultValue != null) {

        if(opt_config.defaultValue instanceof goog.date.Date) {
            this.default_ = opt_config.defaultValue;
            this.value_ = this.default_;
        }
        else if(opt_config.defaultValue == prestans.types.Date.TODAY) {
            this.default_ = opt_config.defaultValue;
            this.value_ = new goog.date.Date();
        }
        else if(goog.isString(opt_config.defaultValue)) {
            var parsedDate_ = goog.date.fromIsoString(opt_config.defaultValue);
            if(parsedDate_ == null)
                throw this.name_+": default date string incorrect format";
            else {
                var date_ = new goog.date.Date(parsedDate_.getFullYear(), parsedDate_.getMonth(), parsedDate_.getDate());

                this.default_ = date_;
                this.value_ = date_;
            }
        }
        else
            throw this.name_+": default must be of acceptable type";
    }

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value))
            throw this.name_+": provided value is not valid";
    }
};

/** @const {!string} */
prestans.types.Date.TODAY = 'prestans.types.Date.TODAY';

/**
 * @final
 *
 * @return {?goog.date.Date}
 */
prestans.types.Date.prototype.getValue = function() {
    return this.value_;
};

/**
 * @final
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Date.prototype.setValue = function(value) {

    //Allow null for not required
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(this.required_ && value == null)
        return false;

    if(value instanceof goog.date.DateTime) {
        this.value_ = new goog.date.Date(value.getFullYear(), value.getMonth(), value.getDate());
        return true;
    }
    //Allow goog.date.Date
    else if(value instanceof goog.date.Date) {
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

/**
 * @final
 *
 * @return {?string}
 */
prestans.types.Date.prototype.getJSONObject = function() {
    if(this.value_ instanceof goog.date.Date)
        return this.value_.toIsoString(true);
    else
        return null;
};