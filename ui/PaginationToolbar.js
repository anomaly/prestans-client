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

goog.provide('prestans.ui.PaginationToolbar');
goog.provide('prestans.ui.PaginationToolbar.Event');

/**
 * @fileoverview
 */


goog.require('goog.ui.Button');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.ui.LinkButtonRenderer');




/**
 * 
 *	{
 *		recordsPerPage: 5,
 *      maxRecords: 10,
 *      recordOffset : 0,
 *      showFeedback: true/false,
 *      simpleFeedback: true/false,
 *      buttonText:
 *      {
 *          first: "First",
 *          previous: "Previous",
 *          next: "Next",
 *          last: "Last",
 *      },
 *		css:
 *      {
 *          toolbar: "css-for-toolbar",
 *          firstButton: "css-for-first-button",
 *          feedback: "css-for-feedback",
 *          previousButton: "css-for-previous-button",
 *          nextButton: "css-for-next-button",
 *      }
 *	}
 *
 * @constructor
 */
prestans.ui.PaginationToolbar = function(opt_domHelper, config) {

	goog.ui.Component.call(this, opt_domHelper);
	this.eventHandler_ = new goog.events.EventHandler(this);
	this.config_ = config;
	
	//Extract record details
	this.recordsPerPage_ = this.config_.recordsPerPage;
	this.maxRecords_ = this.config_.maxRecords;
	
	if(this.maxRecords_ == 0) {
	    this.recordOffset_ = -1;
	    this.currentPage_ = 0;
	}
	else {
	    //round to nearest page size
	    this.recordOffset_ = this.config_.recordOffset - (this.config_.recordOffset % this.recordsPerPage_);
	    this.currentPage_ = ~~(this.recordOffset_ / this.recordsPerPage_) + 1;
    }

};
goog.inherits(prestans.ui.PaginationToolbar, goog.ui.Component);

prestans.ui.PaginationToolbar.EventType = {
    FIRST: "prestans_ui_pagination_toolbar_first",
    PREVIOUS : "prestans_ui_pagination_toolbar_previous",
    NEXT: "prestans_ui_pagination_toolbar_next",
    LAST: "prestans_ui_pagination_toolbar_last"
};

prestans.ui.PaginationToolbar.prototype.config_ = null;
prestans.ui.PaginationToolbar.prototype.recordsPerPage_ = null;
prestans.ui.PaginationToolbar.prototype.maxRecords_ = null;
prestans.ui.PaginationToolbar.prototype.recordOffset_ = null;
prestans.ui.PaginationToolbar.prototype.currentPage_ = null;
prestans.ui.PaginationToolbar.prototype.feedbackLayer_ = null;
prestans.ui.PaginationToolbar.prototype.firstButton_ = null;
prestans.ui.PaginationToolbar.prototype.previousButton_ = null;
prestans.ui.PaginationToolbar.prototype.nextButton_ = null;
prestans.ui.PaginationToolbar.prototype.lastButton_ = null;


prestans.ui.PaginationToolbar.prototype.setMaxRecords = function(maxRecords) {
    this.maxRecords_ = maxRecords;
};

/**
 *
 */
prestans.ui.PaginationToolbar.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

/**
 *
 */
prestans.ui.PaginationToolbar.prototype.decorateInternal = function(element) {

	prestans.ui.PaginationToolbar.superClass_.decorateInternal.call(this, element);
	
	//Add css to toolbar
	if(this.config_.css && this.config_.css.toolbar)
	    goog.dom.classes.add(element, this.config_.css.toolbar);
	    
	this.createFirstButton_(element);
	this.createPreviousButton_(element);
	this.createFeedback_(element);
	this.createNextButton_(element);
	this.createLastButton_(element);
	
	this.updateButtonStates_();
	
};

prestans.ui.PaginationToolbar.prototype.createFeedback_ = function(element) {
    
    var tagName_ = goog.dom.TagName.SPAN;
    if(this.config_.tagNames && this.config_.tagNames.feedback)
        tagName_ = this.config_.tagNames.feedback;
    
    this.feedbackLayer_ = this.dom_.createElement(tagName_);
    element.appendChild(this.feedbackLayer_);
	
	if(this.config_.css && this.config_.css.feedback)
	    goog.dom.classes.add(this.feedbackLayer_, this.config_.css.feedback);
    
    //Add the feedback text
    this.updateFeedback_();
};

prestans.ui.PaginationToolbar.prototype.updateFeedback_ = function() {
    
    if(this.config_.showFeedback) {
    
        var first_ = this.recordOffset_ + 1;
        var last_ = this.recordOffset_ + this.recordsPerPage_;
        
        if(last_ > this.maxRecords_)
            last_ = this.maxRecords_;
    
        var feedbackText_ = first_+" - "+last_+" of ";
    
        if(this.config_.simpleFeedback) {
            
            if(this.maxRecords_ > 999)
                countText_ = "thousands";
            else if(this.maxRecords_ > 99)
                countText_ = "hundreds";
            else
                countText_ = "tens";
                
            feedbackText_ += countText_;
        }
        else {
            feedbackText_ += this.maxRecords_;
        }
    
        this.feedbackLayer_.innerHTML = feedbackText_;
    }
    
};


prestans.ui.PaginationToolbar.prototype.createFirstButton_ = function(element) {
    
    var tagName_ = "button";
    if(this.config_.tagNames && this.config_.tagNames.firstButton)
        tagName_ = this.config_.tagNames.firstButton;
    
    
    this.firstButton_ = this.dom_.createElement(tagName_);
    element.appendChild(this.firstButton_);
	
	if(this.config_.css && this.config_.css.firstButton)
	    goog.dom.classes.add(this.firstButton_, this.config_.css.firstButton);
	    
    var label_ = "First";
    if(this.config_.buttonText && this.config_.buttonText.first)
        label_ = this.config_.buttonText.first;

    this.firstButton_.innerHTML = label_;
	this.eventHandler_.listen(this.firstButton_, goog.events.EventType.CLICK, this.firstButtonAction_);
};

prestans.ui.PaginationToolbar.prototype.firstButtonAction_ = function(event) {

    
    if(this.recordOffset_ >= this.recordsPerPage_) {
    
        this.recordOffset_ = 0;
        this.currentPage_ = 1;
    
        var event_ = new prestans.ui.PaginationToolbar.Event(
            prestans.ui.PaginationToolbar.EventType.FIRST,
            event.target,
            {
                recordsPerPage : this.recordsPerPage_,
                maxRecords : this.maxRecords_,
                recordOffset : this.recordOffset_,
                currentPage : this.currentPage_
            }
        );

        this.updateFeedback_();
        this.updateButtonStates_();
	    this.dispatchEvent(event_);
    }
	
	event.stopPropagation();
	event.preventDefault();
  
};

prestans.ui.PaginationToolbar.prototype.createPreviousButton_ = function(element) {
    
    var tagName_ = "button";
    if(this.config_.tagNames && this.config_.tagNames.previousButton)
        tagName_ = this.config_.tagNames.firstButton;
    
    
    this.previousButton_ = this.dom_.createElement(tagName_);
    element.appendChild(this.previousButton_);
	
	if(this.config_.css && this.config_.css.previousButton)
	    goog.dom.classes.add(this.previousButton_, this.config_.css.previousButton);
	    
    var label_ = "Previous";
    if(this.config_.buttonText && this.config_.buttonText.previous)
        label_ = this.config_.buttonText.previous;

    this.previousButton_.innerHTML = label_;
	this.eventHandler_.listen(this.previousButton_, goog.events.EventType.CLICK, this.previousButtonAction_);
};

prestans.ui.PaginationToolbar.prototype.previousButtonAction_ = function(event) {

    if(this.recordOffset_ > 0) {
        
        this.recordOffset_ -= this.recordsPerPage_;
        this.currentPage_--;

        var event_ = new prestans.ui.PaginationToolbar.Event(
            prestans.ui.PaginationToolbar.EventType.PREVIOUS,
            event.target,
            {
                recordsPerPage : this.recordsPerPage_,
                maxRecords : this.maxRecords_,
                recordOffset : this.recordOffset_,
                currentPage : this.currentPage_
            }
        );
    
        this.updateFeedback_();
        this.updateButtonStates_();
	    this.dispatchEvent(event_);
    }
	event.stopPropagation();
	event.preventDefault();
};

prestans.ui.PaginationToolbar.prototype.createNextButton_ = function(element) {
    
    var tagName_ = "button";
    if(this.config_.tagNames && this.config_.tagNames.nextButton)
        tagName_ = this.config_.tagNames.nextButton;
    
    
    this.nextButton_ = this.dom_.createElement(tagName_);
    element.appendChild(this.nextButton_);
	
	if(this.config_.css && this.config_.css.nextButton)
	    goog.dom.classes.add(this.nextButton_, this.config_.css.nextButton);
	    
    var label_ = "Next";
    if(this.config_.buttonText && this.config_.buttonText.next)
        label_ = this.config_.buttonText.next;

    this.nextButton_.innerHTML = label_;
	this.eventHandler_.listen(this.nextButton_, goog.events.EventType.CLICK, this.nextButtonAction_);
};

prestans.ui.PaginationToolbar.prototype.nextButtonAction_ = function(event) {

    if(this.recordOffset_ + this.recordsPerPage_ < this.maxRecords_) {
        
        this.recordOffset_ += this.recordsPerPage_;
        this.currentPage_++;

        var event_ = new prestans.ui.PaginationToolbar.Event(
            prestans.ui.PaginationToolbar.EventType.NEXT,
            event.target,
            {
                recordsPerPage : this.recordsPerPage_,
                maxRecords : this.maxRecords_,
                recordOffset : this.recordOffset_,
                currentPage : this.currentPage_
            }
        );

        this.updateFeedback_();
        this.updateButtonStates_();
        this.dispatchEvent(event_);
    }
	
	event.stopPropagation();
	event.preventDefault();
};

prestans.ui.PaginationToolbar.prototype.createLastButton_ = function(element) {
    
    var tagName_ = "button";
    if(this.config_.tagNames && this.config_.tagNames.lastButton)
        tagName_ = this.config_.tagNames.lastButton;
    
    
    this.lastButton_ = this.dom_.createElement(tagName_);
    element.appendChild(this.lastButton_);
	
	if(this.config_.css && this.config_.css.lastButton)
	    goog.dom.classes.add(this.lastButton_, this.config_.css.lastButton);
	    
    var label_ = "Last";
    if(this.config_.buttonText && this.config_.buttonText.last)
        label_ = this.config_.buttonText.last;

    this.lastButton_.innerHTML = label_;
	this.eventHandler_.listen(this.lastButton_, goog.events.EventType.CLICK, this.lastButtonAction_);
};

prestans.ui.PaginationToolbar.prototype.lastButtonAction_ = function(event) {
    
    //The ~~ here ensures integer divison is performed and it is not treated as a float
    var lastOffset_ = ~~(this.maxRecords_ / this.recordsPerPage_) * this.recordsPerPage_;
    
    if(this.recordOffset_ < lastOffset_ && this.maxRecords_ > 0) {
        
        this.recordOffset_ = lastOffset_;
        this.currentPage_ = ~~(this.recordOffset_ / this.recordsPerPage_) + 1;

        var event_ = new prestans.ui.PaginationToolbar.Event(
            prestans.ui.PaginationToolbar.EventType.LAST,
            event.target,
            {
                recordsPerPage : this.recordsPerPage_,
                maxRecords : this.maxRecords_,
                recordOffset : this.recordOffset_,
                currentPage : this.currentPage_
            }
        );

        this.updateFeedback_();
        this.updateButtonStates_();
        this.dispatchEvent(event_);
    }
	
	event.stopPropagation();
	event.preventDefault();
};

prestans.ui.PaginationToolbar.prototype.updateButtonStates_ = function() {
    
    /*
    this.recordsPerPage_,
    this.maxRecords_,
    this.recordOffset_,
    this.currentPage_
    */
    
    this.firstButton_.removeAttribute("disabled");
    this.previousButton_.removeAttribute("disabled");
    
    
    //previous, first is impossible if offset < records per page
    if(this.recordOffset_ < this.recordsPerPage_) {
        this.firstButton_.setAttribute("disabled", "disabled");
        this.previousButton_.setAttribute("disabled", "disabled");
    }
    
    //next, last is impossible if offset > count - records per page
    if(this.recordOffset_ > this.maxRecords_ - this.recordsPerPage_) {
        this.nextButton_.setAttribute("disabled", "disabled");
        this.lastButton_.setAttribute("disabled", "disabled");
    }
    
};

/**
 * @constructor
 */
prestans.ui.PaginationToolbar.Event = function(type, target, attributes) {
    goog.events.Event.call(this, type, target);

    this.recordsPerPage_ = attributes.recordsPerPage;
    this.maxRecords_ = attributes.maxRecords;
    this.recordOffset_ = attributes.recordOffset;
    this.currentPage_ = attributes.currentPage;
 
};
goog.inherits(prestans.ui.PaginationToolbar.Event, goog.events.Event);

prestans.ui.PaginationToolbar.Event.prototype.recordsPerPage_ = null;
prestans.ui.PaginationToolbar.Event.prototype.maxRecords_ = null;
prestans.ui.PaginationToolbar.Event.prototype.recordOffset_ = null;
prestans.ui.PaginationToolbar.Event.prototype.currentPage_ = null;

prestans.ui.PaginationToolbar.Event.prototype.getRecordsPerPage = function() {
    return this.recordsPerPage_;
};

prestans.ui.PaginationToolbar.Event.prototype.getMaxRecords = function() {
    return this.maxRecords_;
};

prestans.ui.PaginationToolbar.Event.prototype.getRecordOffset = function() {
    return this.recordOffset_;
};

prestans.ui.PaginationToolbar.Event.prototype.getCurrentPage = function() {
    return this.currentPage_;
};