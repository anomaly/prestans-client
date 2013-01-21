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

goog.provide('prestans.ui.bound.TableCollection');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
prestans.ui.bound.TableCollection = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for TableCollection";

    this.model_ = new this.definition_.modelReference();
	this.valid_ = true;
	this.inputs_ = Array();
	this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.TableCollection, goog.ui.Component);

prestans.ui.bound.TableCollection.prototype.definition_     = null;
prestans.ui.bound.TableCollection.prototype.valid_          = null;
prestans.ui.bound.TableCollection.prototype.model_          = null;
prestans.ui.bound.TableCollection.prototype.inputs_         = null;
prestans.ui.bound.TableCollection.prototype.addButton_      = null;

prestans.ui.bound.TableCollection.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.bound.TableCollection.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.TableCollection.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, "prestans-ui-bound-tablecollection");
	
	//Create the table
	var table_ = this.dom_.createElement(goog.dom.TagName.TABLE);
	element.appendChild(table_);
	
	
	//Create the header for the table
	var thead_ = this.dom_.createElement(goog.dom.TagName.THEAD);
	table_.appendChild(thead_);
	
	goog.array.forEach(this.definition_.columns, function(column) {
	    
	    var th_ = this.dom_.createElement(goog.dom.TagName.TH);
	    th_.innerHTML = column.name;
	    thead_.appendChild(th_);
	    
	}, this);
	
	//Create a column for the buttons
	var actionColumn_ = this.dom_.createElement(goog.dom.TagName.TH);
	if(this.definition_.actionsLabel)
	    actionColumn_.innerHTML = this.definition_.actionsLabel;
	thead_.appendChild(actionColumn_);
	
	//Create the table body
	var tbody_ = this.dom_.createElement(goog.dom.TagName.TBODY);
	table_.appendChild(tbody_);
	
	//Create a row for each element in array
	goog.array.forEach(this.definition_.boundArrayReference(), function(element) {
	    
	    var tr_ = this.createRow_(element);
	    tbody_.appendChild(tr_);
	    
	}, this);
	
	//Create the final row for adding new elements
	var addRow_ = this.dom_.createElement(goog.dom.TagName.TR);
	tbody_.appendChild(addRow_);
	
	//build the add row once the add button has been setup
	this.buildAddRow_(addRow_);	
	
};

prestans.ui.bound.TableCollection.prototype.createRow_ = function(model) {

    var tr_ = this.dom_.createElement(goog.dom.TagName.TR);
    
    //Create the columns
    goog.array.forEach(this.definition_.columns, function(column) {
        
        var td_ = this.dom_.createElement(goog.dom.TagName.TD);
        td_.innerHTML = column.wrappedPropertyGetter(model);
        tr_.appendChild(td_);
        
    }, this);
    
    //Create the delete button
    var deleteColumn_ = this.dom_.createElement(goog.dom.TagName.TD);
    tr_.appendChild(deleteColumn_);
    
    var deleteButton_ = this.dom_.createElement(goog.dom.TagName.BUTTON);
    deleteButton_.innerHTML = this.definition_.deleteButtonLabel;
    
    //Add CSS to button
    if(this.definition_.deleteButtonCss)
        goog.dom.classes.add(deleteButton_, this.definition_.deleteButtonCss);
    
    this.eventHandler_.listen(deleteButton_, goog.events.EventType.CLICK, function(event) {
        goog.dom.removeNode(tr_);
        this.definition_.boundRemoveReference(model);
    }, this);
    deleteColumn_.appendChild(deleteButton_);
    
    return tr_;
     
};

prestans.ui.bound.TableCollection.prototype.buildAddRow_ = function(addRow) {
    
    //Clear out the add row
    goog.dom.removeChildren(addRow);
    goog.array.clear(this.inputs_);
    
	goog.array.forEach(this.definition_.columns, function(column) {
	    
	    var td_ = this.dom_.createElement(goog.dom.TagName.TD);
	    addRow.appendChild(td_);
	    
	    //Create a definition if one wasn't provided
	    var definition_ = column.definition;
	    if(!definition_) {
	        definition_  = {};
	    }
	    
	    //Added the bound getter and setter to definition
	    definition_.boundPropertyGetter = goog.bind(function() {
	        return column.wrappedPropertyGetter(this.model_);
	    }, this);
	    definition_.boundPropertySetter = goog.bind(function(value) {
	        return column.wrappedPropertySetter(this.model_, value);
	    }, this);
	    
	    var input_ = new column.type(this.dom_, definition_);
	    goog.array.insert(this.inputs_, input_);
	    input_.render(td_);
	    
	}, this);
	
	//Create the add button
	var addCell_ = this.dom_.createElement(goog.dom.TagName.TD);
	addRow.appendChild(addCell_);
	
	//Create the add button
	this.addButton_ = this.dom_.createElement(goog.dom.TagName.BUTTON);
	this.addButton_.innerHTML = this.definition_.addButtonLabel;
    
    //Add CSS to button
    if(this.definition_.addButtonCss)
        goog.dom.classes.add(this.addButton_, this.definition_.addButtonCss);
    
    this.eventHandler_.listen(this.addButton_, goog.events.EventType.CLICK, function(event) {
	    
	    //Add model to the bound array
	    this.definition_.boundAddReference(this.model_);
	    
	    //Add a row to the table
	    var row_ = this.createRow_(this.model_);
	    this.dom_.insertSiblingBefore(row_, addRow);
	    
	    //Create a new model
	    this.model_ = new this.definition_.modelReference();
	    this.buildAddRow_(addRow); //rebuild the add row
	    this.changed_();
	    
	}, this);
	addCell_.appendChild(this.addButton_);
	
	//setup the event listeners
	goog.array.forEach(this.inputs_, function(input) {
	    this.eventHandler_.listen(input, goog.ui.Component.EventType.CHANGE, this.changed_);
	}, this);
	this.changed_(); //run once to setup the add button correctly
    
};

prestans.ui.bound.TableCollection.prototype.changed_ = function(event) {
    
    //check that each input is valid
    var valid_ = true;
    goog.array.forEach(this.inputs_, function(input) {
        
        if(!input.isValid()) {
            valid_ = false;
            return;
        }
        
    }, this);
    
    if(valid_) {
        this.addButton_.removeAttribute("disabled");
        
        //this.addButton_.setEnabled(true);
        //this.addButton_.removeClassName("disabled");
    }
    else {
        this.addButton_.setAttribute("disabled", "disabled");
        
        //this.addButton_.setEnabled(false);
        //this.addButton_.addClassName("disabled");
    }

};

prestans.ui.bound.TableCollection.prototype.callModelSetter_ = function(value) {
    
    if(this.definition_.boundPropertySetter)
        return this.definition_.boundPropertySetter(value);
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.TableCollection.prototype.isValid = function() {
    return this.valid_;
};