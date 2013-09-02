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

goog.provide('prestans.ui.bound.DatePicker');

goog.require('goog.events.EventHandler');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.ui.LabelInput');

/**
 * @constructor
 */
prestans.ui.bound.DatePicker = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for DatePicker";
		
	this.valid_ = false;
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.DatePicker, goog.ui.Component);

prestans.ui.bound.DatePicker.prototype.definition_      = null;
prestans.ui.bound.DatePicker.prototype.valid_           = null;
prestans.ui.bound.DatePicker.prototype.labelInput_      = null;
prestans.ui.bound.DatePicker.prototype.datePicker_      = null;

prestans.ui.bound.DatePicker.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.bound.DatePicker.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.TextArea.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, "prestans-ui-bound-datepicker");
	
	if(this.definition_.label)
        this.labelInput_ = new goog.ui.LabelInput(this.definition_.label, this.dom_);
    else
        this.labelInput_ = new goog.ui.LabelInput("DD/MM/YYYY", this.dom_);

    this.labelInput_.render(element);

    var pattern = "dd'/'MM'/'yyyy";
    if(this.definition_.pattern) {
        pattern = this.definition_.pattern;
    }
    
    var formatter = new goog.i18n.DateTimeFormat(pattern);
    var parser = new goog.i18n.DateTimeParse(pattern);

    this.datePicker_ = new goog.ui.InputDatePicker(formatter, parser);
    
    if(this.definition_.boundPropertyGetter && this.definition_.boundPropertyGetter() != null) {
        this.labelInput_.setValue(formatter.format(this.definition_.boundPropertyGetter()));
        this.datePicker_.setDate(this.definition_.boundPropertyGetter());
    }
    
    this.datePicker_.decorate(this.labelInput_.getElement());
	
	this.eventHandler_.listen(this.datePicker_, goog.ui.Component.EventType.CHANGE, this.changed_);
	this.changed_(); //call once to check initial value
	
};

prestans.ui.bound.DatePicker.prototype.exitDocument = function() {
    goog.base(this, 'exitDocument');

    this.datePicker_.dispose();
};

prestans.ui.bound.DatePicker.prototype.changed_ = function(event) {
    
    this.valid_ = this.callModelSetter_(this.datePicker_.getDate());
    
    if(this.valid_)
        goog.dom.classes.remove(this.labelInput_, "prestans-ui-bound-form-error");
    else
        goog.dom.classes.add(this.labelInput_, "prestans-ui-bound-form-error");
    
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.DatePicker.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.DatePicker.prototype.isValid = function() {
    return this.valid_;
};