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

goog.provide('prestans.ui.bound.Radio');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
prestans.ui.bound.Radio = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for Radio";
	
	if(definition.labels)
	    if(definition.choices.length != definition.labels.length)
	        throw "Choices length does not match labels length";

	this.valid_ = false;
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.Radio, goog.ui.Component);

prestans.ui.bound.Radio.Layout = {
    HORIZONTAL : "horizontal",
    VERTICAL : "vertical"
};

prestans.ui.bound.Radio.Label = {
    BEFORE : "top",
    AFTER : "right"
};

prestans.ui.bound.Radio.prototype.definition_    = null;
prestans.ui.bound.Radio.prototype.valid_         = null;

prestans.ui.bound.Radio.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.bound.Radio.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.Radio.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, "prestans-ui-bound-radio");
	
	for(var index = 0; index < this.definition_.choices.length; index++) {
	    
	    var radio_ = this.dom_.createElement(goog.dom.TagName.INPUT);
	    radio_.type = "radio";
	    radio_.name = this.definition_.name;
	    
	    var label_ = this.dom_.createElement(goog.dom.TagName.SPAN);
	    goog.dom.classes.add(label_, "prestans-ui-bound-radio-label");
        
        if(this.definition_.labels) {
            radio_.value = this.definition_.choices[index];
            label_.innerHTML = this.definition_.labels[index];;
        }
        else {
            radio_.value = this.definition_.choices[index];
            label_.innerHTML = this.definition_.choices[index];;
        }
            
        this.eventHandler_.listen(radio_, goog.ui.Component.EventType.CHANGE, function(event) {
            this.changed_(event.target);
        });
        if(this.definition_.boundPropertyGetter)
        	if(this.definition_.boundPropertyGetter() == radio_.value) {
        	    radio_.checked = "checked";
        	    this.changed_(radio_);
    	    }
        
        if(this.definition_.labelPosition == prestans.ui.bound.Radio.Label.BEFORE) {
            element.appendChild(label_);
            element.appendChild(radio_);
            if(this.definition_.layout == prestans.ui.bound.Radio.Layout.VERTICAL) {
                var break_ = this.dom_.createElement(goog.dom.TagName.BR);
                element.appendChild(break_);
            }
        }
        else {
            element.appendChild(radio_);
            element.appendChild(label_);
            if(this.definition_.layout == prestans.ui.bound.Radio.Layout.VERTICAL) {
                var break_ = this.dom_.createElement(goog.dom.TagName.BR);
                element.appendChild(break_);
            }
        }
        
	}
	
	//Add CSS classes
    if(this.definition_.css)
        goog.dom.classes.add(element, this.definition_.css);
	
};

prestans.ui.bound.Radio.prototype.changed_ = function(radio) {
    
    this.valid_ = this.callModelSetter_(radio.value);
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.Radio.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.Radio.prototype.isValid = function() {
    return this.valid_;
};