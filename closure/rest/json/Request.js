/*
Copyright (c) 2012, Eternity Technologies
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
- Redistributions of source code must retain the above copyright
  notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the following
  disclaimer in the documentation and/or other materials
  provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
THE POSSIBILITY OF SUCH DAMAGE.
*/

goog.provide('prestans.rest.json.Request');

goog.require('goog.array');
goog.require('goog.string.format');

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
    urlFormat: ,
    urlArgs:
}
*/

/**
 * @param {Object} config
 *
 * @constructor
 */
prestans.rest.json.Request = function(config) {

    this.setIdentifier(config.identifier);
    this.setUrl(config.urlFormat, config.urlArgs);
    this.setHttpMethod(config.httpMethod);

    this.parameters_ = new Array();
    if(goog.isDef(config.parameters) && goog.isArray(config.parameters)) {
        goog.array.forEach(config.parameters, function(parameter) {
            this.addParameter(parameter.key, parameter.value);
        }, this);
    }

    this.setRequestModel(config.requestModel);
    this.setResponseModel(config.responseModel);
    this.setRequestFilter(config.requestFilter);
    this.setResponseFilter(config.responseFilter);
    this.setArrayElementTemplate(config.arrayElementTemplate);
    this.setResponseModelElementTemplates(config.responseModelElementTemplates);
    this.setResponseFilter(config.responseFilter);
    this.setCancelable(config.cancelable);
};

prestans.rest.json.Request.prototype.identifier_                    = null;
prestans.rest.json.Request.prototype.cancelable_                    = null;
prestans.rest.json.Request.prototype.urlFormat_                     = null;
prestans.rest.json.Request.prototype.urlArgs_                       = null;
prestans.rest.json.Request.prototype.parameters_                    = null;
prestans.rest.json.Request.prototype.httpMethod_                    = null;
prestans.rest.json.Request.prototype.requestFilter_                 = null;
prestans.rest.json.Request.prototype.requestModel_                  = null;
prestans.rest.json.Request.prototype.responseFilter_                = null;
prestans.rest.json.Request.prototype.responseModel_                 = null;
prestans.rest.json.Request.prototype.arrayElementTemplate_          = null;
prestans.rest.json.Request.prototype.responseModelElementTemplates_ = null;

prestans.rest.json.Request.prototype.setIdentifier = function(identifier) {
    if(goog.isDef(identifier) && goog.isString(identifier))
        this.identifier_ = identifier;
    else
        throw "identifier must be provided and of type string"
};
prestans.rest.json.Request.prototype.getIdentifier = function() {
    return this.identifier_;
};

prestans.rest.json.Request.prototype.setCancelable = function(cancelable) {
    if(goog.isDef(cancelable) && goog.isBoolean(cancelable))
        this.cancelable_ = cancelable;
    else
        this.cancelable_ = true;
};
prestans.rest.json.Request.prototype.getCancelable = function() {
    return this.cancelable_;
};

prestans.rest.json.Request.prototype.setUrl = function(urlFormat, urlArgs) {

    //URL format
    if(goog.isDef(urlFormat) && goog.isString(urlFormat))
        this.urlFormat_ = urlFormat;
    else
        throw "url format must be provided and of type string";

    //URL arguments
    if(goog.isDef(urlArgs) && goog.isArray(urlArgs))
        this.urlArgs_ = urlArgs;
    else
        this.urlArgs_ = new Array();

};

/*
Google string format expects arguments in this format
http://stackoverflow.com/questions/676721/calling-dynamic-function-with-dynamic-parameters-in-javascript
*/
prestans.rest.json.Request.prototype.getUrl = function() {

    var args_ = new Array();
    goog.array.insert(args_, this.urlFormat_);
    goog.array.insertArrayAt(args_, this.urlArgs_, 1);

    return goog.string.format.apply(this, args_);
};
prestans.rest.json.Request.prototype.getUrlWithParameters = function() {
    
    var parameterString_ = "";
    
    if(!goog.array.isEmpty(this.parameters_)) {
    
        parameterString_ = "?";
    
        goog.array.forEach(this.parameters_, function(parameter) {
            if(goog.isArray(parameter.value))
                parameterString_+= parameter.key+"="+parameter.value.toString()+"&";
            else
                parameterString_+= parameter.key+"="+parameter.value+"&";
        }, this);
    
        //remove trailing &
        parameterString_ = parameterString_.substr(0, parameterString_.length - 1);
    
    }

    if(this.responseFilter_ != null) {
        if(goog.array.isEmpty(this.parameters_))
            parameterString_ = "?_response_attribute_list="+this.responseFilter_.getJSONString();
        else
            parameterString_ = parameterString_ + "&_response_attribute_list="+this.responseFilter_.getJSONString();

    }
    
    return this.getUrl()+parameterString_;
};

prestans.rest.json.Request.prototype.setHttpMethod = function(httpMethod) {
    //HTTP method
    if(goog.isDef(httpMethod) && goog.isString(httpMethod))
        this.httpMethod_ = httpMethod;
    else
        throw "http method must be provided and of type string";
};
prestans.rest.json.Request.prototype.getHttpMethod = function() {
    return this.httpMethod_;
};

prestans.rest.json.Request.prototype.setRequestFilter = function(requestFilter) {
    if(goog.isDef(requestFilter) && requestFilter instanceof prestans.types.Filter)
        this.requestFilter_ = requestFilter;
};
prestans.rest.json.Request.prototype.getRequestFilter = function() {
    return this.requestFilter_;
};

prestans.rest.json.Request.prototype.setRequestModel = function(requestModel) {

    if((goog.isDef(requestModel) && requestModel instanceof prestans.types.Model) || requestModel == null)
        this.requestModel_ = requestModel;
    else
        throw "Body model must be of type prestans.types.Model";

};
prestans.rest.json.Request.prototype.getRequestModel = function() {
    return this.requestModel_;
};

prestans.rest.json.Request.prototype.setResponseFilter = function(responseFilter) {
    if(goog.isDef(responseFilter) && responseFilter instanceof prestans.types.Filter)
        this.responseFilter_ = responseFilter;
};
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

prestans.rest.json.Request.prototype.getArrayElementTemplate = function() {
    return this.arrayElementTemplate_;
};

prestans.rest.json.Request.prototype.setArrayElementTemplate = function(arrayElementTemplate) {
    if(goog.isDef(arrayElementTemplate))
        this.arrayElementTemplate_ = arrayElementTemplate;
};

prestans.rest.json.Request.prototype.getResponseModelElementTemplates = function() {
    return this.responseModelElementTemplates_;
};

prestans.rest.json.Request.prototype.setResponseModelElementTemplates = function(responseModelElementTemplates) {
    if(goog.isDef(responseModelElementTemplates))
        if(goog.isObject(responseModelElementTemplates))
            this.responseModelElementTemplates_ = responseModelElementTemplates;
        else
            throw "response model templates must be an object";
};

prestans.rest.json.Request.prototype.clearParameters = function() {
    goog.array.clear(this.parameters_);
};

//Appends the parameter to the parameters list
prestans.rest.json.Request.prototype.addParameter = function(paramKey, paramValue) {
    
    var param_ = {
        key: paramKey,
        value: paramValue
    };
    
    goog.array.insert(this.parameters_, param_);
};

prestans.rest.json.Request.prototype.removeParameter = function(key) {
    if(!goog.array.isEmpty(this.parameters_)) {

        var clone_ = goog.array.clone(this.parameters_);
        goog.array.forEach(clone_, function(element, index, array) {
            if(element.key == key)
                goog.array.remove(this.parameters_, element);
        }, this);
    }
};