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

goog.provide('prestans.rest.json.Request');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.string.format');

goog.require('prestans');
goog.require('prestans.types.Filter');
goog.require('prestans.types.Model');

/*
Sample configuration
{
    identifier: Unique identifier for this request type,
    cancelable: Boolean default: false
    httpMethod: One of prestans.net.HttpMethod,
    parameters: [
        {
            key: 
            value: 
        }
    ],
    requestFilter: Instance of prestans.types.Filter (optional),
    requestModel: Instance of prestans.types.Model (optional),
    responseFilter: Instance of prestans.types.Filter (optional),
    responseModel: Used to unpack the returned response,
    arrayElementTemplate: Used if response model is an array
    responseModelElementTemplates: {
        key: value
    },
    urlFormat: string,
    urlArgs: Array
}
*/

/**
 * @constructor
 * @param {!Object} config
 */
prestans.rest.json.Request = function(config) {

    this.setIdentifier(config.identifier);
    //this.setUrl(config.urlFormat, config.urlArgs);

    /**
     * @private
     * @type {!string}
     */
    this.urlFormat_ = config.urlFormat;

    /**
     * @private
     * @type {!Array}
     */
    this.urlArgs_ = [];
    if(goog.isDef(config.urlArgs) && goog.isArray(config.urlArgs))
        this.urlArgs_ = config.urlArgs;

    /**
     * @private
     * @type {!prestans.net.HttpMethod}
     */
    this.httpMethod_ = prestans.net.HttpMethod.GET;
    if(config.httpMethod)
        this.setHttpMethod(config.httpMethod);

    /**
     * @private
     * @type {!Array<Object>}
     */
    this.parameters_ = [];
    if(goog.isDef(config.parameters) && goog.isArray(config.parameters)) {
        goog.array.forEach(config.parameters, function(parameter) {
            this.addParameter(parameter.key, parameter.value);
        }, this);
    }

    this.setRequestModel(config.requestModel);
    this.setResponseModel(config.responseModel);

    /**
     * @private
     * @type {?prestans.types.Filter}
     */
    this.requestFilter_ = null;
    if(goog.isDef(config.requestFilter) && config.requestFilter instanceof prestans.types.Filter)
        this.requestFilter_ = config.requestFilter;

    /**
     * @private
     * @type {?prestans.types.Filter}
     */
    this.responseFilter_ = null;
    if(goog.isDef(config.responseFilter) && config.responseFilter instanceof prestans.types.Filter)
        this.responseFilter_ = config.responseFilter;

    /**
     * @private
     * @type {!boolean}
     */
    this.isArray_ = false;
    if(goog.isDef(config.isArray))
        this.setIsArray(config.isArray);

    /**
     * @private
     * @type {!boolean}
     */
    this.cancelable_ = true;
    if(goog.isDef(config.cancelable))
        this.setCancelable(config.cancelable);
};

/**
 * Generates a new unique identifier
 * @param {!string} identifier
 */
prestans.rest.json.Request.prototype.setIdentifier = function(identifier) {

    /**
     * @private
     * @type {!string}
     */
    this.identifier_ = goog.string.format("%s_%s", identifier, goog.string.createUniqueString());
};

/**
 * Returns the unique identifier for this request
 * @return {!string}
 */
prestans.rest.json.Request.prototype.getIdentifier = function() {
    return this.identifier_;
};

/**
 * @param {!boolean} cancelable
 */
prestans.rest.json.Request.prototype.setCancelable = function(cancelable) {
    this.cancelable_ = cancelable;
};

/**
 * @return {!boolean}
 */
prestans.rest.json.Request.prototype.getCancelable = function() {
    return this.cancelable_;
};

/**
 * @param {!string} urlFormat
 * @param {!Array=} opt_urlArgs
 * @deprecated
 */
prestans.rest.json.Request.prototype.setUrl = function(urlFormat, opt_urlArgs) {

    this.urlFormat_ = urlFormat;

    if(goog.isDef(opt_urlArgs) && goog.isArray(opt_urlArgs))
        this.urlArgs_ = opt_urlArgs;
    else
        this.urlArgs_ = [];
};

/**
 * Google string format expects arguments in this format
 * http://stackoverflow.com/questions/676721/calling-dynamic-function-with-dynamic-parameters-in-javascript
 *
 * @return {!string}
 */
prestans.rest.json.Request.prototype.getUrl = function() {

    var args_ = [];
    goog.array.insert(args_, this.urlFormat_);
    goog.array.insertArrayAt(args_, this.urlArgs_, 1);

    return goog.string.format.apply(this, args_);
};

/**
 * @return {!string}
 */
prestans.rest.json.Request.prototype.getUrlWithParameters = function() {
    
    var parameterString_ = "";
    
    if(!goog.array.isEmpty(this.parameters_)) {
    
        parameterString_ = "?";
    
        goog.array.forEach(this.parameters_, function(parameter) {
            if(goog.isArray(parameter.value)) {
                
                goog.array.forEach(parameter.value, function(value) {
                    parameterString_+= goog.string.format("%s=%s&", encodeURIComponent(parameter.key), encodeURIComponent(value.toString()));
                }, this);
                
            }
            else
                parameterString_ += goog.string.format("%s=%s&", encodeURIComponent(parameter.key), encodeURIComponent(parameter.value))
        }, this);
    
        //remove trailing &
        parameterString_ = parameterString_.substr(0, parameterString_.length - 1);
    
    }

    return this.getUrl()+parameterString_;
};

/**
 * @param {!prestans.net.HttpMethod} httpMethod
 */
prestans.rest.json.Request.prototype.setHttpMethod = function(httpMethod) {
    this.httpMethod_ = httpMethod;
};

/**
 * @return {!prestans.net.HttpMethod}
 */
prestans.rest.json.Request.prototype.getHttpMethod = function() {
    return this.httpMethod_;
};

/**
 * @return {?prestans.types.Filter}
 */
prestans.rest.json.Request.prototype.getRequestFilter = function() {
    return this.requestFilter_;
};

prestans.rest.json.Request.prototype.setRequestModel = function(requestModel) {

    if((goog.isDef(requestModel) && requestModel instanceof prestans.types.Model) || (goog.isDef(requestModel) && requestModel instanceof prestans.types.Array) || requestModel == null)
        this.requestModel_ = requestModel;
    else
        throw "Body model must be of type prestans.types.Model";

};
prestans.rest.json.Request.prototype.getRequestModel = function() {
    return this.requestModel_;
};

/*
prestans.rest.json.Request.prototype.setResponseFilter = function(responseFilter) {
    if(goog.isDef(responseFilter) && responseFilter instanceof prestans.types.Filter)
        this.responseFilter_ = responseFilter;
};
*/

/**
 * @return {?prestans.types.Filter}
 */
prestans.rest.json.Request.prototype.getResponseFilter = function() {
    return this.responseFilter_;
};

prestans.rest.json.Request.prototype.getResponseModel = function() {
    return this.responseModel_;
};
prestans.rest.json.Request.prototype.setResponseModel = function(responseModel) {
    if(goog.isDef(responseModel))
        this.responseModel_ = responseModel;
    else
        throw "responseModel must be provided";
};

/**
 * @return {!boolean}
 */
prestans.rest.json.Request.prototype.getIsArray = function() {
    return this.isArray_;
};

/**
 * @param {!boolean} isArray
 */
prestans.rest.json.Request.prototype.setIsArray = function(isArray) {
    this.isArray_ = isArray;
};

prestans.rest.json.Request.prototype.clearParameters = function() {
    goog.array.clear(this.parameters_);
};

/**
 * Appends parameter to the parameters list
 * @param {!string} paramKey
 * @param {!string} paramValue
 */
prestans.rest.json.Request.prototype.addParameter = function(paramKey, paramValue) {
    
    var param_ = {
        key: paramKey,
        value: paramValue
    };
    
    goog.array.insert(this.parameters_, param_);
};

/**
 * Removes parameter from the parameters list
 * @param {!string} paramKey
 */
prestans.rest.json.Request.prototype.removeParameter = function(paramKey) {
    if(!goog.array.isEmpty(this.parameters_)) {

        var clone_ = goog.array.clone(this.parameters_);
        goog.array.forEach(clone_, function(element) {
            if(element.key == paramKey)
                goog.array.remove(this.parameters_, element);
        }, this);
    }
};