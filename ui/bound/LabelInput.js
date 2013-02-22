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

goog.provide('prestans.ui.bound.LabelInput');

goog.require('goog.events.EventHandler');
goog.require('goog.events.InputHandler');

/**
 * @constructor
 */
prestans.ui.bound.LabelInput = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for LabelInput";

	this.valid_ = false;
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.LabelInput, goog.ui.Component);

prestans.ui.bound.LabelInput.prototype.definition_    = null;
prestans.ui.bound.LabelInput.prototype.valid_         = null;

prestans.ui.bound.LabelInput.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.INPUT));
};

prestans.ui.bound.LabelInput.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.LabelInput.superClass_.decorateInternal.call(this, element);

    //Set the name if one was provided
    if(this.definition_.name)
        element.setAttribute("name", this.definition_.name);

    //Setup the starting value or use the label
    if(this.definition_.boundPropertyGetter) {
        var value_ = this.definition_.boundPropertyGetter();
        if(value_ != null)
            element.value = value_;
        else if(this.definition_.label) {
            element.value = this.definition_.label;
            
            if(this.definition_.labelCss)
                goog.dom.classes.add(element, this.definition_.labelCss);
        }
    }
    //Add CSS classes
    if(this.definition_.css)
        goog.dom.classes.add(element, this.definition_.css);

    if(this.definition_.label) {
	    this.eventHandler_.listen(element, goog.events.EventType.FOCUS, this.focus_);
	    this.eventHandler_.listen(element, goog.events.EventType.BLUR, this.blur_);
    }
    
    //Check to see if input is read only
    if(this.definition_.readOnly) {
        element.disabled = "disabled";
    }
    else {
	    this.eventHandler_.listen(element, goog.events.InputHandler.EventType.INPUT, this.changed_);
    }
    
    //Apply the max length if one was provided
    if(typeof(this.definition_.maxLength) !== 'undefined')
        element.setAttribute("maxlength", this.definition_.maxLength);
    
    //call once to check initial value
    this.changed_();
	
};

prestans.ui.bound.LabelInput.prototype.changed_ = function(event) {
    
    if(this.getElement().value == this.definition_.label)
        this.valid_ = this.callModelSetter_(null);
    else
        this.valid_ = this.callModelSetter_(this.getElement().value);
    
    if(this.definition_.errorCss) {
        if(this.valid_)
            goog.dom.classes.remove(this.getElement(), this.definition_.errorCss);
        else
            goog.dom.classes.add(this.getElement(), this.definition_.errorCss);
    }
    
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.LabelInput.prototype.focus_ = function(event) {
	var inputBox = event.target;
	if(inputBox.value == this.definition_.label) {
		inputBox.value = '';
	}

    if(this.definition_.labelCss)
        goog.dom.classes.remove(inputBox, this.definition_.labelCss);
};

prestans.ui.bound.LabelInput.prototype.blur_ = function(event) {
	var inputBox = event.target;
	if(inputBox.value == '') {
		inputBox.value = this.definition_.label;
		
		if(this.definition_.labelCss)
            goog.dom.classes.add(inputBox, this.definition_.labelCss);
	}
};

prestans.ui.bound.LabelInput.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.LabelInput.prototype.isValid = function() {
    return this.valid_;
};