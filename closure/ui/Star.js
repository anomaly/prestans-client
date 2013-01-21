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

goog.provide('prestans.ui.Star');

goog.require('prestans.ui.Event.StarClicked');

/**
 * @constructor
 */
prestans.ui.Star = function(opt_domHelper, opt_status) {
	goog.ui.Component.call(this, opt_domHelper);
	if (opt_status) this.enabled_ = opt_status;
	else this.enabled_ = false;
};
goog.inherits(prestans.ui.Star, goog.ui.Component);

prestans.ui.Star.prototype.eventHandler_	= null;
prestans.ui.Star.prototype.enabled_		= null;
prestans.ui.Star.prototype.classNames_	= null;

prestans.ui.Star.EventType = {
    CLICK: goog.events.getUniqueId('_PRESTANS_STAR_EVENT_CLICK')
}

prestans.ui.Star.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.Star.prototype.decorateInternal = function(element) {
	
	prestans.ui.Star.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, 'prestans-ui-star');
	
	this.eventHandler_ = new goog.events.EventHandler(this);
	
	/* Add the appropriate class depending on what we need */
	if(this.enabled_) goog.dom.classes.add(element, 'prestans-ui-star-on');
	else goog.dom.classes.add(element, 'prestans-ui-star-off')
	
	/* Event handlers */
	this.eventHandler_.listen(element, goog.events.EventType.CLICK, this.starClicked_);

};

prestans.ui.Star.prototype.addClassName = function(className) {
	var element = this.getElement();
	goog.dom.classes.add(element, className);
};

prestans.ui.Star.prototype.starClicked_ = function(event) {
	
	/* Ensure no one else responds to this click */
	event.stopPropagation();
	
	var element = this.getElement();
	if(this.enabled_) goog.dom.classes.swap(element, 'prestans-ui-star-on', 'prestans-ui-star-off');
	else goog.dom.classes.swap(element, 'prestans-ui-star-off', 'prestans-ui-star-on');

	this.enabled_ = !this.enabled_;
	
	/* Dispatch events for all those who want to know */
	var clickEvent_ = new prestans.ui.Event.StarClicked(prestans.ui.Star.EventType.CLICK, this.enabled_);
	this.dispatchEvent(clickEvent_);
	
	event.preventDefault();

};