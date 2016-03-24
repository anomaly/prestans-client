//
// Copyright (c) 2015, Anomaly Software
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// - Redistributions of source code must retain the above copyright
//   notice, this list of conditions and the following disclaimer.
// - Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the following
//   disclaimer in the documentation and/or other materials
//   provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
// THE POSSIBILITY OF SUCH DAMAGE.
//

goog.provide('prestans.rest.json.Response');

goog.require('prestans');
goog.require('prestans.types.Array');

/**
 * @typedef {{
 *    requestIdentifier:string,
 *    isArray:boolean,
 *    responseModel:function(new:prestans.types.Model),
 *    responseBody:string,
 *    minified:boolean,
 *    statusCode:goog.net.HttpStatus
 *  }}
 */
prestans.rest.json.ResponseConfig;

/**
 * @constructor
 * @param {!prestans.rest.json.ResponseConfig} config
 */
prestans.rest.json.Response = function(config) {

    /**
     * @private
     * @type {!string}
     */
    this.requestIdentifier_ = config.requestIdentifier;

    /**
     * @private
     * @type {!boolean}
     */
    this.isArray_ = config.isArray;

    /**
     * @private
     * @type {!function(new:prestans.types.Model)}
     */
    this.responseModel_ = config.responseModel;

    /**
     * @private
     * @type {!string}
     */
    this.responseBody_ = config.responseBody;
    
    /**
     * @private
     * @type {!boolean}
     */
    this.minified_ = config.minified;

    /**
     * @private
     * @type {!goog.net.HttpStatus}
     */
    this.statusCode_ = config.statusCode;
};

/** const {!string} */
prestans.rest.json.Response.EMPTY_BODY = "prestans.rest.json.Response.EMPTY_BODY";

/**
 * @return {!string}
 */
prestans.rest.json.Response.prototype.getRequestIdentifier = function() {
    return this.requestIdentifier_;
};

/**
 * @return {!goog.net.HttpStatus}
 */
prestans.rest.json.Response.prototype.getStatusCode = function() {
    return this.statusCode_;
};

/**
 * Unpacks the response body using the model specified in the request.
 *
 * @return {!prestans.types.Model|!prestans.types.Array}
 */
prestans.rest.json.Response.prototype.getUnpackedBody = function() {
    if(this.isArray_)
        return this.unpackBodyAsArrayWithTemplate(this.responseModel_);
    else
        return this.unpackBodyWithTemplate(this.responseModel_);
};

/**
 * @param {!function(new:prestans.types.Model)} bodyTemplate
 *
 * @return {!prestans.types.Array}
 */
prestans.rest.json.Response.prototype.unpackBodyAsArrayWithTemplate = function(bodyTemplate) {

    return new prestans.types.Array({
        elementTemplate: bodyTemplate,
        opt_json: this.responseBody_,
        opt_minified: this.minified_
    });
};

/**
 * Unpacks the response body using a provided model.
 * @param bodyTemplate
 *
 * @return {!prestans.types.Model}
 */
prestans.rest.json.Response.prototype.unpackBodyWithTemplate = function(bodyTemplate) {

    return new bodyTemplate(this.responseBody_, this.minified_);
};