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
goog.provide('prestans.types.DateTime');

goog.require('goog.date.DateTime');
goog.require('goog.date.UtcDateTime');

goog.require('prestans');

/**
 * @constructor
 * @param {Object=} opt_config
 */
prestans.types.DateTime = function(opt_config) {

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
    this.name_ = "DateTime";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * required defaults to true
     * @type {!boolean}
     * @private
     */
    this.required_ = true;
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;

    /**
     * timezone defaults to false
     * @type {!boolean}
     * @private
     */
    this.timezone_ = false;
    if(goog.isDef(opt_config.timezone))
        this.timezone_ = opt_config.timezone;

    /**
     * utc defaults to false
     * @type {!boolean}
     * @private
     */
    this.utc_ = false;
    if(goog.isDef(opt_config.utc))
        this.utc_ = opt_config.utc;

    //Check that default is defined and not null
    if(goog.isDef(opt_config.defaultValue) && opt_config.defaultValue != null) {

        if(opt_config.defaultValue instanceof goog.date.DateTime) {
            this.default_ = opt_config.defaultValue;
            this.value_ = this.default_;
        }
        else if(opt_config.defaultValue == prestans.types.DateTime.NOW) {
            this.default_ = opt_config.defaultValue;
            this.value_ = new goog.date.DateTime();
        }
        else if(goog.isString(opt_config.defaultValue)) {
            var parsedDate_ = goog.date.fromIsoString(opt_config.defaultValue);
            if(parsedDate_ == null)
                throw this.name_+": default date string incorrect format";
            else {
                this.default_ = parsedDate_;
                this.value_ = parsedDate_;
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
prestans.types.DateTime.NOW = 'prestans.types.DateTime.NOW';

/**
 * @return {?goog.date.DateTime}
 */
prestans.types.DateTime.prototype.getValue = function() {
    return this.value_;
};

/**
 * @param {?} value
 *
 * @return {!boolean}
 */
prestans.types.DateTime.prototype.setValue = function(value) {

    //Allow null for not required
    if(!this.required_ && goog.isNull(value)) {
        this.value_ = null;
        return true;
    }
    //Disallow null for required
    else if(this.required_ && goog.isNull(value))
        return false;

    //Allow goog.date.DateTime
    if(value instanceof goog.date.DateTime) {
        this.value_ = value;
        return true;
    }

    //Allow string
    if(goog.isString(value)) {
        var parsedDate_ = goog.date.fromIsoString(value);   
        if(parsedDate_ == null)
            return false;
        else {
            this.value_ = parsedDate_;
            return true;
        }

    }

    //Unacceptable type
    return false;
};

/**
 * @return {?string}
 */
prestans.types.DateTime.prototype.getJSONObject = function() {
    if(this.value_ instanceof goog.date.DateTime)
        if(this.utc_)
            return this.value_.toUTCIsoString(true, this.timezone_);
        else
            return this.value_.toIsoString(true, this.timezone_);
    else
        return null;
};

/******************
 * CLASS METHODS
 ******************/

/**
 * @param {goog.date.DateTime} datetime
 *
 * @return {goog.date.UtcDateTime}
 */
prestans.types.DateTime.asUTC = function(datetime) {
    return new goog.date.UtcDateTime(
        datetime.getFullYear(),
        datetime.getMonth(),
        datetime.getDate(),
        datetime.getHours(),
        datetime.getMinutes(),
        datetime.getSeconds(),
        datetime.getMilliseconds()
    );
};