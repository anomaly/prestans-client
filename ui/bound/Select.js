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

goog.provide('prestans.ui.bound.Select');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
prestans.ui.bound.Select = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for Select";
	
	if(definition.labels)
	    if(definition.choices.length != definition.labels.length)
	        throw "Choices length does not match labels length";

	this.valid_ = false;
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.Select, goog.ui.Component);

prestans.ui.bound.Select.prototype.definition_    = null;
prestans.ui.bound.Select.prototype.valid_         = null;

prestans.ui.bound.Select.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.SELECT));
};

prestans.ui.bound.Select.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.Select.superClass_.decorateInternal.call(this, element);
	
	for(var index = 0; index < this.definition_.choices.length; index++) {
	    
	    var option_ = this.dom_.createElement(goog.dom.TagName.OPTION);
	    
        
        if(this.definition_.labels) {
            option_.innerHTML = this.definition_.labels[index];
            option_.value = this.definition_.choices[index];
        }
        else {
            option_.innerHTML = this.definition_.choices[index];
            option_.value = this.definition_.choices[index];
        }
            

        if(this.definition_.boundPropertyGetter)
        	if(this.definition_.boundPropertyGetter() == option_.value)
        	    option_.selected = "selected";
        
        element.appendChild(option_);
	}
	
	//Add CSS classes
    if(this.definition_.css)
        goog.dom.classes.add(element, this.definition_.css);
	
	this.eventHandler_.listen(element, goog.ui.Component.EventType.CHANGE, this.changed_);
	this.changed_(); //call once to check initial value
	
};

prestans.ui.bound.Select.prototype.changed_ = function(event) {
    
    this.valid_ = this.callModelSetter_(this.getElement().value);
    
    if(this.definition_.errorCss) {
        if(this.valid_)
            goog.dom.classes.remove(this.getElement(), this.definition_.errorCss);
        else
            goog.dom.classes.add(this.getElement(), this.definition_.errorCss);
    }
    
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.Select.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.Select.prototype.isValid = function() {
    return this.valid_;
};