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

goog.provide('prestans.ui.bound.Form');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
prestans.ui.bound.Form = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for Form";
		
	this.inputs_ = Array();
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.Form, goog.ui.Component);

/*
Constants for configuration
Consider using goog.events.getUnqiueId here.
*/
prestans.ui.bound.Form.Layout = {
    HORIZONTAL : "horizontal",
    VERTICAL : "vertical"
};

prestans.ui.bound.Form.Label = {
    TOP : "top",
    RIGHT : "right",
    BOTTOM : "bottom",
    LEFT : "left"
};

prestans.ui.bound.Form.prototype.definition_    = null;
prestans.ui.bound.Form.prototype.inputs_        = null;

prestans.ui.bound.Form.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(this.definition_.formTagName));
};

prestans.ui.bound.Form.prototype.decorateInternal = function(element) {

	prestans.ui.bound.Form.superClass_.decorateInternal.call(this, element);
	
	//Add CSS to the form if any exists
	if(this.definition_.formCss)
	    goog.dom.classes.add(element, this.definition_.formCss);
	
	//Sections
	goog.array.forEach(this.definition_.sections, function(section) {
	    
	    //Create the section container
	    var section_ = this.dom_.createElement(section.sectionTagName);
	    element.appendChild(section_);
	    
	    //Addition of custom CSS for section
        if(section.sectionCss)
            goog.dom.classes.add(section_, section.sectionCss);
	    
	    //Create a header if a name was provided for the section, otherwise do nothing
	    if(section.name) {
	        var header_ = this.dom_.createElement(section.headerTagName);
	        header_.innerHTML = section.name;
	        section_.appendChild(header_);
	        
	        //Addition of custom CSS for header
            if(section.headerCss)
                goog.dom.classes.add(header_, section.headerCss);
	    }
	    
	    var fields_ = this.dom_.createElement(section.fieldsTagName);
	    section_.appendChild(fields_);
	    
	    //Addition of custom CSS for header
        if(section.fieldsCss)
            goog.dom.classes.add(fields_, section.fieldsCss);
	    
	    if(section.fields) {
	    
	        //Create all the fields for this section
	        goog.array.forEach(section.fields, function(field) {
	        
	        var field_ = this.dom_.createElement(field.fieldTagName);
	            
	        //Addition of custom CSS for field
            if(field.fieldCss)
                goog.dom.classes.add(field_, field.fieldCss);
	            
	        fields_.appendChild(field_);
	        
	        //If a valid type and field was supplied
	        if(field.type && field.label) {
	        
    	        var label_ = this.dom_.createElement(field.labelTagName);
    	        label_.innerHTML = field.label;
    	        if(field.labelCss)
    	            goog.dom.classes.add(label_, field.labelCss);
	        
    	        var inputContainer_ = this.dom_.createElement(goog.dom.TagName.DIV);
            
                //Render the input component
                var input_ = new field.type(this.dom_, field.definition);
                goog.array.insert(this.inputs_, input_);
                this.eventHandler_.listen(input_, goog.ui.Component.EventType.CHANGE, this.fieldChanged_);
                
                //DOM insertion for label and input
                if(field.inputFirst) {
                    input_.render(field_);
                    field_.appendChild(label_);
                }
                else {
                    field_.appendChild(label_);
                    input_.render(field_);
                }
            
            }
            else if(field.type) {
                
                //Render the input component
                var input_ = new field.type(this.dom_, field.definition);
                goog.array.insert(this.inputs_, input_);
                this.eventHandler_.listen(input_, goog.ui.Component.EventType.CHANGE, this.fieldChanged_);
                
                input_.render(field_);
            }
            //If it wasn't then only label should be displayed
            else if(field.label) {
                
                var label_ = this.dom_.createElement(field.labelTagName);
    	        label_.innerHTML = field.label;
    	        field_.appendChild(label_);
    	        
                if(field.labelCss)
                    goog.dom.classes.add(label_, field.labelCss);
                
            }
            //if neither provided we will do nothing
	        
	        
	    }, this);
        }
	}, this);
};

prestans.ui.bound.Form.prototype.fieldChanged_ = function() {
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.Form.prototype.show = function() {
    goog.style.showElement(this.getElement(), true);
};

prestans.ui.bound.Form.prototype.hide = function() {
    goog.style.showElement(this.getElement(), false);
};

prestans.ui.bound.Form.prototype.isValid = function() {
    
    var valid_ = true;
    
    goog.array.forEach(this.inputs_, function(input) {
        
        if(!input.isValid()) {
            valid_ = false;

            return;
        }
        
    }, this);

    return valid_;
};

