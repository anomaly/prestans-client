//
// Copyright (c) 2013, Eternity Technologies
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

goog.provide('prestans.rest.json.Client.Event');
goog.provide('prestans.rest.json.Client');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrManager');
goog.require('goog.string');

goog.require('prestans.rest.json.Response');

/**
 * @constructor
 *
 * @param {string} baseUrl
 * @param {class} opt_numRetries
 *
 *
 */
prestans.rest.json.Client = function(baseUrl, opt_numRetries) {
    
    goog.events.EventTarget.call(this);

    this.baseUrl_ = baseUrl;
    
    if(opt_numRetries) this.numRetries_ = opt_numRetries;
    else this.numRetries_ = 0;
    
    this.eventHandler_ = new goog.events.EventHandler(this);
    this.cancelableRequestIds_ = new Array();

    var headers_ = new goog.structs.Map({
        "Accept": "application/json"
    });

    // Shared XhrManager
    this.xhrManager_ = new goog.net.XhrManager(this.numRetries_, headers_);
    
};
goog.inherits(prestans.rest.json.Client, goog.events.EventTarget);

prestans.rest.json.Client.EventType = {
    RESPONSE: goog.events.getUniqueId('prestans-rest-json-client-event-type-response'),
    FAILURE: goog.events.getUniqueId('prestans-rest-json-client-event-type-response')
};

/**
 * @private
 */
prestans.rest.json.Client.prototype.baseUrl_                  = null;
prestans.rest.json.Client.prototype.numRetries_               = null;
prestans.rest.json.Client.prototype.cancelableRequestIds_     = null;
prestans.rest.json.Client.prototype.xhrManager_               = null;

/**
 * Aborts all pending requests
 */
prestans.rest.json.Client.prototype.abortAllPendingRequests = function() {
    goog.array.forEach(this.cancelableRequestIds_, function(requestId) { 
        this.xhrManager_.abort(requestId, true);
    }, this);
    // Empty the request array
    goog.array.clear(this.cancelableRequestIds_);  
};

prestans.rest.json.Client.prototype.makeRequest = function(request, callbackSuccessMethod, callbackFailureMethod, opt_abortPreviousRequests) {

    var objectAsJson_ = null;
    if(request.getRequestModel() && request.getRequestFilter())
        objectAsJson_ = request.getRequestModel().getJSONString(request.getRequestFilter());
    else if(request.getRequestModel())
        objectAsJson_ = request.getRequestModel().getJSONString();

    var completeURL_ = this.baseUrl_ + request.getUrlWithParameters();
    
    // Abort all requests if this is true
    if(goog.isDef(opt_abortPreviousRequests) && opt_abortPreviousRequests == true) {
        this.abortAllPendingRequests();
    }
    
    // Append this to the list of ids
    if(request.getCancelable()) {
        var uniqueId_ = goog.string.format("%s %s", request.getIdentifier(), goog.string.createUniqueString());
        goog.array.insert(this.cancelableRequestIds_, uniqueId_);
    }


    var headers_ = new goog.structs.Map();
    //Add content type header for request bodies
    if(request.getRequestModel())
        headers_.set("Content-Type", "application/json");
    //Add response filter if present
    if(request.getResponseFilter())
        headers_.set("Prestans-Response-Attribute-List", request.getResponseFilter().getJSONString());

    this.xhrManager_.send(uniqueId_, completeURL_, request.getHttpMethod(), objectAsJson_, headers_, null, goog.bind(function(response){

        // Remove this from the list
        goog.array.remove(this.cancelableRequestIds_, uniqueId_);

        var responseJson_ = null;
        if(request.getResponseModel() != prestans.rest.json.Response.EMPTY_BODY)
            responseJson_ = response.target.getResponseJson();

        var responseConfig_ = {
            requestIdentifier: request.getIdentifier(),
            statusCode: response.target.getStatus(),
            responseModel: request.getResponseModel(),
            arrayElementTemplate: request.getArrayElementTemplate(),
            responseBody: responseJson_
        };

        var response_ = new prestans.rest.json.Response(responseConfig_);

        // Failure
        if(!response.target.isSuccess()) {
            this.dispatchEvent(new prestans.rest.json.Client.Event(prestans.rest.json.Client.EventType.FAILURE, this, response_));
            if(callbackFailureMethod) callbackFailureMethod(response_);
        }
        else {
            this.dispatchEvent(new prestans.rest.json.Client.Event(prestans.rest.json.Client.EventType.RESPONSE, this, response_));
            if(callbackSuccessMethod) callbackSuccessMethod(response_); 
        }
        
       
        
    }, this));
    
};

/**
 * @constructor
 */
prestans.rest.json.Client.Event = function(type, target, response) {
    goog.events.Event.call(this, type, target);
    this.response_ = response;
};
goog.inherits(prestans.rest.json.Client.Event, goog.events.Event);

prestans.rest.json.Client.Event.prototype.response_     = null;

prestans.rest.json.Client.Event.prototype.getResponse = function() {
    return this.response_;
};