//
//  prestans, Google Closure components for Ajax development
//  http://prestans.googlecode.com
//
//  Copyright (c) 2013, Eternity Technologies Pty Ltd.
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

goog.provide('prestans.ui.ActionToolbar');

/**
 * @fileoverview
 */

goog.require('goog.events.EventHandler');
goog.require('goog.ui.Button');
goog.require('goog.ui.LinkButtonRenderer');

/**
 * 
 * [
 *	{
 *		title: "Save Draft",
 *		cssClassNames: ['y2t-app-listing-editor-button-save-draft'],
 *		actionOutlet: goog.bind(this.functionOutlet_, this)
 *	},
 * ]
 *
 * @constructor
 */
prestans.ui.ActionToolbar = function(opt_domHelper, buttonMap) {

	goog.ui.Component.call(this, opt_domHelper);

	if (buttonMap)
		this.buttonMap_ = buttonMap;
	else 
		this.buttonMap_ = new Array();

	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.ActionToolbar, goog.ui.Component);

/**
 * @param {goog.events.EventHandler} Locally bound Event dispatcher
 */
prestans.ui.ActionToolbar.prototype.eventHandler_	= null;

/**
 * @param {Array} Local copy of Button information Map
 */
prestans.ui.ActionToolbar.prototype.buttonMap_		= null;


/**
 *
 */
prestans.ui.ActionToolbar.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

/**
 *
 */
prestans.ui.ActionToolbar.prototype.decorateInternal = function(element) {

	prestans.ui.ActionToolbar.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, goog.getCssName('prestans-ui-actionbar-container'));
	
	goog.array.forEach(this.buttonMap_, function(buttonInfo) {
		
		var button_ = new goog.ui.Button(buttonInfo.title, goog.ui.LinkButtonRenderer.getInstance());
		button_.addClassName('prestans-ui-actionbar-button');
		
		if(buttonInfo.cssClassNames) {
			goog.array.forEach(buttonInfo.cssClassNames, function(cssClassName) {
				button_.addClassName(cssClassName);
			}, this);			
		}
		
		this.eventHandler_.listen(button_, goog.ui.Component.EventType.ACTION, buttonInfo.actionOutlet);
		
		button_.render(element);
		
	}, this);
	
};


/**
 *
 */
prestans.ui.ActionToolbar.prototype.addClassName = function(cssClassName) {
	if(!cssClassName) return;
	var element_ = this.getElement();
	//goog.dom.classes.add(element_, cssClassName);
};