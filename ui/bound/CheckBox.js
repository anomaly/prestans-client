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

goog.provide('prestans.ui.bound.CheckBox');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
prestans.ui.bound.CheckBox = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for CheckBox";
		
	this.valid_ = false;
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.CheckBox, goog.ui.Component);

prestans.ui.bound.CheckBox.prototype.definition_    = null;
prestans.ui.bound.CheckBox.prototype.valid_         = null;

prestans.ui.bound.CheckBox.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.INPUT));
};

prestans.ui.bound.CheckBox.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.CheckBox.superClass_.decorateInternal.call(this, element);
	element.type = "checkbox";
	
	//setup css
	if(this.definition_.css)
	    goog.dom.classes.add(element, this.definition_.css);
	
	
	if(this.definition_.boundPropertyGetter) {
	    if(this.definition_.boundPropertyGetter())
	        element.checked = "checked";
	}
	
	this.eventHandler_.listen(element, goog.ui.Component.EventType.CHANGE, this.changed_);
	this.changed_(); //call once to check initial value
	
};

prestans.ui.bound.CheckBox.prototype.changed_ = function(event) {
    
    var value_ = false;
    if(this.getElement().checked)
        value_ = true;
    
    this.valid_ = this.callModelSetter_(value_);
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.CheckBox.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.CheckBox.prototype.isValid = function() {
    return this.valid_;
};