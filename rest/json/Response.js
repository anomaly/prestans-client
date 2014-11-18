//
// Copyright (c) 2014, Anomaly Software
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

/*
{
    requestIdentifier: The string identifier for the request type,
    statusCode: HTTP status code,
    responseModel: Class used to unpack response body,
    arrayElementTemplate: prestans.types.Model,
    responseModelElementTemplates: {
        key: value
    },
    responseBody: JSON Object (Optional)
}
*/

/**
 * @param {string} requestIdentifier
 * @param {number} statusCode HTTP status of the response.
 *
 * @constructor
 */
prestans.rest.json.Response = function(config) {

    this.requestIdentifier_ = config.requestIdentifier;
    this.isArray_ = config.isArray;
    this.responseModel_ = config.responseModel;
    this.responseBody_ = config.responseBody;
    this.minified_ = config.minified;

    if(goog.isDef(config.statusCode) && goog.isNumber(config.statusCode))
        this.statusCode_ = config.statusCode;
    else
        throw "status code must be provided and of type number";
};

//constant used to skip body unpack
prestans.rest.json.Response.EMPTY_BODY = "prestans.rest.json.Response.EMPTY_BODY";

prestans.rest.json.Response.prototype.requestIdentifier_    = null;
prestans.rest.json.Response.prototype.responseModel_        = null;
prestans.rest.json.Response.prototype.responseBody_         = null;
prestans.rest.json.Response.prototype.statusCode_           = null;

prestans.rest.json.Response.prototype.getRequestIdentifier = function() {
    return this.requestIdentifier_;
};

prestans.rest.json.Response.prototype.getStatusCode = function() {
    return this.statusCode_;
};

prestans.rest.json.Response.prototype.getUnpackedBody = function() {
    if(this.responseModel_ == prestans.rest.json.Response.EMPTY_BODY)
        throw "responseModel must be provided or use prestans.rest.json.Response.EMPTY_BODY";
    else if(this.isArray_)
        return this.unpackBodyAsArrayWithTemplate(this.responseModel_);
    else
        return this.unpackBodyWithTemplate(this.responseModel_);
};

prestans.rest.json.Response.prototype.unpackBodyAsArrayWithTemplate = function(bodyTemplate) {

    var unpackedBody_ = null;

    //If a response body was provided we should try to unpack it
    if(goog.isDefAndNotNull(bodyTemplate)) {

        if(new bodyTemplate() instanceof prestans.types.Model) {
            unpackedBody_ = new prestans.types.Array({
                elementTemplate: bodyTemplate,
                opt_json: this.responseBody_,
                opt_minified: this.minified_
            });
        }
        else
            throw "responseModel is not an acceptable type: must be subclass of prestans.types.Model";
    }

    return unpackedBody_;
};

prestans.rest.json.Response.prototype.unpackBodyWithTemplate = function(bodyTemplate) {
    
    var unpackedBody_ = null;

    //If a response body was provided we should try to unpack it
    if(goog.isDefAndNotNull(bodyTemplate)) {

        if(new bodyTemplate() instanceof prestans.types.Model)
            unpackedBody_ = new bodyTemplate(this.responseBody_, this.minified_);
        else
            throw "responseModel is not an acceptable type: must be subclass of prestans.types.Model";
    }

    return unpackedBody_;
};