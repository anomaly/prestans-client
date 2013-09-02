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

goog.provide('prestans.ui.bound.Wizard');

goog.require('goog.events.EventHandler');

goog.require('prestans.ui.bound.Form');

/**
 * @constructor
 */
prestans.ui.bound.Wizard = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "Wizard requires a definition";

    this.crumbs_ = new Array();
    this.forms_ = new Array();

	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.Wizard, goog.ui.Component);

prestans.ui.bound.Wizard.prototype.eventHandler_        = null;
prestans.ui.bound.Wizard.prototype.definition_          = null;
prestans.ui.bound.Wizard.prototype.crumbs_              = null;
prestans.ui.bound.Wizard.prototype.forms_               = null;
prestans.ui.bound.Wizard.prototype.selectedForm_        = null;
prestans.ui.bound.Wizard.prototype.selectedCrumb_       = null;

prestans.ui.bound.Wizard.EventType = {
    FORM_CHANGED: goog.events.getUniqueId('prestans.ui.bound.Wizard.FORM_CHANGED')
};

prestans.ui.bound.Wizard.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.bound.Wizard.prototype.decorateInternal = function(element) {

	prestans.ui.bound.Wizard.superClass_.decorateInternal.call(this, element);
    
    //Create naviation layer
    var navigationLayer_ = this.dom_.createElement(this.definition_.navigationTagName);
    if(this.definition_.navigationCss)
        goog.dom.classes.add(navigationLayer_, this.definition_.navigationCss);
	element.appendChild(navigationLayer_);
	
	var ul_ = this.dom_.createElement(goog.dom.TagName.UL);
	navigationLayer_.appendChild(ul_);
	
	//Create the form layer
    var formLayer_ = this.dom_.createElement(goog.dom.TagName.DIV);
    element.appendChild(formLayer_);
	
	goog.array.forEach(this.definition_.sections, function(section) {

        //Create the form and a keep a reference to it
	    var form_ = new prestans.ui.bound.Form(this.dom_, section.formDefinition);
        form_.render(formLayer_);
        form_.hide();
        goog.array.insert(this.forms_, form_);
        
        //Listen for change events
        this.eventHandler_.listen(form_, goog.ui.Component.EventType.CHANGE, function(event) {
            this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
        }, this);
	    
	    //Render the navigation link second
	    var li_ = this.dom_.createElement(goog.dom.TagName.LI);
    	ul_.appendChild(li_);
    	
    	var a_ = this.dom_.createElement(goog.dom.TagName.A);
    	goog.array.insert(this.crumbs_, a_);
    	a_.innerHTML = section.name;
    	a_.href="#";
    	li_.appendChild(a_);
    	this.eventHandler_.listen(a_, goog.events.EventType.CLICK, function(event) {
    	    
    	    event.preventDefault();
    	    
    	    this.makeCrumbInactive_(this.selectedCrumb_);
    	    
    	    this.selectedForm_ = form_;
    	    this.selectedCrumb_ = a_;
    	    
    	    this.makeCrumbActive_(this.selectedCrumb_);
    	    
    	    this.hideAllForms_();
    	    form_.show();
    	    
    	    this.dispatchEvent(prestans.ui.bound.Wizard.EventType.FORM_CHANGED);
    	    
    	}, this);
	    
	}, this);
	
	this.selectedCrumb_ = this.crumbs_[0];
	this.selectedForm_ = this.forms_[0];
	    
    this.makeCrumbActive_(this.selectedCrumb_);    
	this.selectedForm_.show();
};

prestans.ui.bound.Wizard.prototype.exitDocument = function() {
    goog.base(this, 'exitDocument');

    goog.array.forEach(this.forms_, function(form) {
        form.dispose();
    }, this);
};

prestans.ui.bound.Wizard.prototype.makeCrumbActive_ = function(activeCrumb) {
    
    var crumbIndex_ = 0;
    var activeFound_ = false;
    
    //Make previous crumbs visited
    if(this.definition_.visitedCss) {
    
        while(crumbIndex_ < this.crumbs_.length && !activeFound_) {
        
            var crumb_ = this.crumbs_[crumbIndex_];
        
            if(crumb_ == activeCrumb)
                activeFound_ = true;
            else
                goog.dom.classes.add(crumb_, this.definition_.visitedCss);
        
            crumbIndex_++;
        }
    }
    
    //Make the last crumb active
    if(this.definition_.activeCss)
        goog.dom.classes.add(activeCrumb, this.definition_.activeCss);
    
};

prestans.ui.bound.Wizard.prototype.makeCrumbInactive_ = function(activeCrumb) {
    
    //Make previous crumbs unvisited
    if(this.definition_.visitedCss) {
        goog.array.forEach(this.crumbs_, function(crumb) {
            goog.dom.classes.remove(crumb, this.definition_.visitedCss);
        }, this);   
    }
    
    //Make the last crumb inactive
    if(this.definition_.activeCss)
        goog.dom.classes.remove(activeCrumb, this.definition_.activeCss);
};

prestans.ui.bound.Wizard.prototype.hideAllForms_ = function() {
    goog.array.forEach(this.forms_, function(form) {
        form.hide();
    }, this);
};


prestans.ui.bound.Wizard.prototype.previous = function() {
    
    var index_ = goog.array.indexOf(this.forms_, this.selectedForm_);
        
    if(index_ > 0) {
        
        this.makeCrumbInactive_(this.selectedCrumb_);
	    
	    this.selectedForm_ = this.forms_[index_-1];
	    this.selectedCrumb_ = this.crumbs_[index_-1];
	    
	    this.makeCrumbActive_(this.selectedCrumb_);
	    
	    this.hideAllForms_();
	    this.selectedForm_.show();
	    
	    this.dispatchEvent(prestans.ui.bound.Wizard.EventType.FORM_CHANGED);
    }
};

prestans.ui.bound.Wizard.prototype.next = function() {

    var index_ = goog.array.indexOf(this.forms_, this.selectedForm_);
        
    if(index_ < this.forms_.length - 1 && index_ != -1) {
        
        this.makeCrumbInactive_(this.selectedCrumb_);
	    
	    this.selectedForm_ = this.forms_[index_+1];
	    this.selectedCrumb_ = this.crumbs_[index_+1];
	    
	    this.makeCrumbActive_(this.selectedCrumb_);
	    
	    this.hideAllForms_();
	    this.selectedForm_.show();
	    
	    this.dispatchEvent(prestans.ui.bound.Wizard.EventType.FORM_CHANGED);
    }
};

prestans.ui.bound.Wizard.prototype.isFirstForm = function() {
    
    if(this.forms_.length > 0)
        return this.selectedForm_ == this.forms_[0];
    else
        return false;
};

prestans.ui.bound.Wizard.prototype.isLastForm = function() {
    if(this.forms_.length > 0)
        return this.selectedForm_ == this.forms_[this.forms_.length - 1];
    else
        return false;
};

prestans.ui.bound.Wizard.prototype.isValid = function() {
    
    var valid_ = true;
    
    goog.array.forEach(this.forms_, function(form) {
        
        if(!form.isValid()) {
            valid_ = false;
            return;
        }
        
    }, this);
    
    return valid_;
};