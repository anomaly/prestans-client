//
//  prestans, Google Closure components for Ajax development
//  http://prestans.googlecode.com
//
//  Copyright (c) 2012, Eternity Technologies Pty Ltd.
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//      * Redistributions of source code must retain the above copyright
//        notice, this list of conditions and the following disclaimer.
//      * Redistributions in binary form must reproduce the above copyright
//        notice, this list of conditions and the following disclaimer in the
//        documentation and/or other materials provided with the distribution.
//      * Neither the name of Eternity Technologies nor the
//        names of its contributors may be used to endorse or promote products
//        derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL ETERNITY TECHNOLOGIES BE LIABLE FOR ANY
//  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

goog.provide('prestans.ui.IframeFileUpload');

/**
 * @fileoverview
 */

goog.require('goog.events.EventHandler');
goog.require('goog.net.IframeIo');

goog.require('prestans.net.HttpMethod');

/**
 * 
 *
 * @constructor
 */
prestans.ui.IframeFileUpload = function(opt_domHelper) {
	goog.ui.Component.call(this, opt_domHelper);
	this.eventHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(prestans.ui.IframeFileUpload, goog.ui.Component);

prestans.ui.IframeFileUpload.prototype.eventHandler_	 = null;
prestans.ui.IframeFileUpload.prototype.formElement_		 = null;
prestans.ui.IframeFileUpload.prototype.fileInput_		 = null;
prestans.ui.IframeFileUpload.prototype.iframeIo_		 = null;

prestans.ui.IframeFileUpload.EventType = {
	FILE_SELECTED: '_PRESTANS_UI_IFRAMEFILEUPLOAD_FILE_SELECTED',
	SUCCESS: '_PRESTANS_UI_IFRAMEFILEUPLOAD_SUCCESS',
	FAILED: '_PRESTANS_UI_IFRAMEFILEUPLOAD_FAILURE'
};

/**
 *
 */
prestans.ui.IframeFileUpload.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};


/**
 *
 */
prestans.ui.IframeFileUpload.prototype.decorateInternal = function(element) {

	prestans.ui.IframeFileUpload.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, goog.getCssName('prestans-ui-iframe-upload-container'));

	this.decorateForm_(element);

};

prestans.ui.IframeFileUpload.prototype.setEnabled = function(enabled) {
	if(enabled)
	    this.fileInput_.disabled = "";
	else
	    this.fileInput_.disabled = "disabled";
};

prestans.ui.IframeFileUpload.prototype.clear = function() {
	this.fileInput_.value = "";
};

prestans.ui.IframeFileUpload.prototype.show = function() {
	var element_ = this.getElement();
};

prestans.ui.IframeFileUpload.prototype.hide = function() {
	var element_ = this.getElement();	
};

prestans.ui.IframeFileUpload.prototype.postToUrl = function(targetUrl) {

	this.formElement_.action = targetUrl;
	this.iframeIo_ = new goog.net.IframeIo();

	this.eventHandler_.listen(this.iframeIo_, goog.net.EventType.SUCCESS, function(event){
		this.dispatchEvent(new goog.events.Event(prestans.ui.IframeFileUpload.EventType.SUCCESS, this));
		event.stopPropagation();
	});
	
	this.eventHandler_.listen(this.iframeIo_, goog.net.EventType.ERROR, function(event){
		this.dispatchEvent(new goog.events.Event(prestans.ui.IframeFileUpload.EventType.FAILED, this));
		event.stopPropagation();
	});
	
	this.iframeIo_.sendFromForm(this.formElement_);
	
};

prestans.ui.IframeFileUpload.prototype.getResponseJson = function() {
    if(this.iframeIo_ != null)
        return this.iframeIo_.getResponseJson();
    else
        return null;
};

prestans.ui.IframeFileUpload.prototype.getResponseText = function() {
    if(this.iframeIo_ != null)
        return this.iframeIo_.getResponseText();
    else
        return null;
};

/**
 * 
 * @private
 */
prestans.ui.IframeFileUpload.prototype.decorateForm_ = function(parentLayer) {
	
	var formLayer_ = this.dom_.createElement(goog.dom.TagName.DIV);
	goog.dom.classes.add(formLayer_, 'prestans-ui-iframe-upload-formlayer')
	parentLayer.appendChild(formLayer_);
	
	this.formElement_ = this.dom_.createElement(goog.dom.TagName.FORM);
	goog.dom.classes.add(this.formElement_, 'prestans-ui-iframe-upload-form');
	this.formElement_.method = prestans.net.HttpMethod.POST;
	this.formElement_.enctype = 'multipart/form-data';
	
	formLayer_.appendChild(this.formElement_);

	this.fileInput_ = this.dom_.createElement(goog.dom.TagName.INPUT);
	goog.dom.classes.add(this.fileInput_, 'prestans-ui-iframe-upload-file-input');
	this.fileInput_.type = 'FILE';
	this.fileInput_.name = 'file-data';
	
	this.formElement_.appendChild(this.fileInput_);
	
	this.eventHandler_.listen(this.fileInput_, goog.events.EventType.CHANGE, function(event){
		this.dispatchEvent(prestans.ui.IframeFileUpload.EventType.FILE_SELECTED);
		event.stopPropagation();
	});
	
};