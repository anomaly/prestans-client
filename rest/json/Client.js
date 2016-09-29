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

goog.provide('prestans.rest.json.Client.Event');
goog.provide('prestans.rest.json.Client');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrManager');
goog.require('goog.string');

goog.require('prestans');
goog.require('prestans.rest.json.Response');

/**
 * @constructor
 * @param {!Object} config
 *
 * @extends {goog.events.EventTarget}
 */
prestans.rest.json.Client = function(config) {
    
    goog.events.EventTarget.call(this);

    /**
     * @type {!string}
     * @private
     */
    this.baseUrl_ = config.baseUrl;

    /**
     * @type {!number}
     * @private
     */
    this.numRetries_ = 0;
    if(goog.isDef(config.opt_numRetries))
        this.numRetries_ = config.opt_numRetries;

    /**
     * @type {!boolean}
     * @private
     */
    this.minified_ = false;
    if(goog.isDef(config.opt_minified))
        this.minified_ = config.opt_minified;

    /**
     * @type {!goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler(this);

    /**
     * @type {Array<!string>}
     * @private
     */
    this.cancelableRequestIds_ = new Array();

    var headers_ = new goog.structs.Map({
        "Accept": "application/json",
        "Prestans-Version": prestans.GLOBALS.VERSION,
        "Prestans-Minification": this.minified_ ? "On" : "Off"
    });

    /**
     * @type {goog.net.XhrManager}
     * @private
     */
    this.xhrManager_ = new goog.net.XhrManager(this.numRetries_, headers_);
    
};
goog.inherits(prestans.rest.json.Client, goog.events.EventTarget);

/**
 * Compiler directive to translate these into strings
 * @enum {!string}
 */
prestans.rest.json.Client.EventType = {
    RESPONSE: goog.events.getUniqueId('PRESTANS'),
    FAILURE: goog.events.getUniqueId('PRESTANS')
};

/**
 * Aborts all pending requests
 * @final
 */
prestans.rest.json.Client.prototype.abortAllPendingRequests = function() {
    goog.array.forEach(this.cancelableRequestIds_, function(requestId) { 
        this.xhrManager_.abort(requestId, true);
    }, this);
    // Empty the request array
    goog.array.clear(this.cancelableRequestIds_);  
};

/**
 * @param {!string} requestId
 */
prestans.rest.json.Client.prototype.abortByRequestId = function(requestId) {
    if(goog.array.contains(this.cancelableRequestIds_, requestId)) {
        this.xhrManager_.abort(requestId, true);
        goog.array.remove(this.cancelableRequestIds_, requestId);
    }
};

/**
 * @deprecated Use dispatchRequest with the same parameters
 */
prestans.rest.json.Client.prototype.makeRequest = function(request, callbackSuccessMethod, callbackFailureMethod, opt_abortPreviousRequests) {
    this.dispatchRequest(request, callbackSuccessMethod, callbackFailureMethod, opt_abortPreviousRequests);
};

/**
 * @param {!prestans.rest.json.Request} request
 * @param callbackSuccessMethod
 * param callbackFailureMethod
 * @param {!boolean=} opt_abortPreviousRequests
 */
prestans.rest.json.Client.prototype.dispatchRequest = function(request, callbackSuccessMethod, callbackFailureMethod, opt_abortPreviousRequests) {

    var objectAsJson_ = null;
    if(request.getRequestModel() && goog.isDefAndNotNull(request.getRequestFilter()))
        objectAsJson_ = request.getRequestModel().getJSONString(this.minified_, request.getRequestFilter());
    else if(request.getRequestModel())
        objectAsJson_ = request.getRequestModel().getJSONString(this.minified_);

    var completeURL_ = this.baseUrl_ + request.getUrlWithParameters();
    
    //Abort all requests if this is true
    if(goog.isDef(opt_abortPreviousRequests) && opt_abortPreviousRequests == true)
        this.abortAllPendingRequests();
    
    //Append this to the list of ids if it is cancellable
    if(request.getCancelable())
        goog.array.insert(this.cancelableRequestIds_, request.getIdentifier());


    var headers_ = new goog.structs.Map();
    //Add content type header for request bodies
    if(request.getRequestModel())
        headers_.set("Content-Type", "application/json");
    //Add response filter if present
    if(request.getResponseFilter())
        headers_.set("Prestans-Response-Attribute-List", request.getResponseFilter().getJSONString(this.minified_, false));

    this.xhrManager_.send(request.getIdentifier(), completeURL_, request.getHttpMethod(), objectAsJson_, headers_, 0, goog.bind(function(response){

        // Remove this from the list
        goog.array.remove(this.cancelableRequestIds_, request.getIdentifier());

        var responseJson_ = null;
        if(request.getResponseModel() != prestans.rest.json.Response.EMPTY_BODY)
            responseJson_ = response.target.getResponseJson();

        var responseConfig_ = {
            requestIdentifier: request.getIdentifier(),
            statusCode: response.target.getStatus(),
            responseModel: request.getResponseModel(),
            isArray: request.getIsArray(),
            responseBody: responseJson_,
            minified: this.minified_
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
 * @param {!prestans.rest.json.Client.EventType} type
 * @param target
 * @param {!prestans.rest.json.Response} response
 *
 * @extends {goog.events.Event}
 */
prestans.rest.json.Client.Event = function(type, target, response) {
    goog.events.Event.call(this, type, target);

    /**
     * @type {!prestans.rest.json.Response}
     * @private
     */
    this.response_ = response;
};
goog.inherits(prestans.rest.json.Client.Event, goog.events.Event);

/**
 * @return {!prestans.rest.json.Response}
 */
prestans.rest.json.Client.Event.prototype.getResponse = function() {
    return this.response_;
};