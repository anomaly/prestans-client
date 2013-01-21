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

goog.provide('prestans.ui.TimeInput');

/**
 * @constructor
 */
prestans.ui.TimeInput = function(opt_domHelper, opt_initialTime) {
	goog.ui.Component.call(this, opt_domHelper);
	
	if(opt_initialTime) this.initialTime_ = opt_initialTime;
	else this.initialTime_ = "12:00 AM";
	
	this.separator_ = ':';
	this.ampmPrefix_ = ' ';
	this.ampmNames_ = ['AM', 'PM'];
	this.ampmField_ = 2;
	this.secondField_ = -1;
	this.eventHandler_ = new goog.events.EventHandler(this);
	this.show24Hours_ = false;
	this.timeSteps_ = [1, 1, 1];
	this.defaultTime_ = new Date(0, 0, 1, 12);

	this.selectedHour_ = parseInt(this.initialTime_.substring(0,2), 10);
	this.selectedMinute_ = parseInt(this.initialTime_.substring(3,5), 10);

	if(this.initialTime_.substring(6,8) == "PM") this.selectedHour_ += 12;
	
};
goog.inherits(prestans.ui.TimeInput, goog.ui.Component);

prestans.ui.TimeInput.prototype.initialTime_		= null;

prestans.ui.TimeInput.prototype.getModelValue_	= null;
prestans.ui.TimeInput.prototype.setModelValue_	= null;
prestans.ui.TimeInput.prototype.eventHandler_ 	= null;
prestans.ui.TimeInput.prototype.textBox_		 	= null;

prestans.ui.TimeInput.prototype.separator_	 	= null;
prestans.ui.TimeInput.prototype.ampmPrefix_		= null;
prestans.ui.TimeInput.prototype.ampmNames_		= null;
prestans.ui.TimeInput.prototype.ampmField_		= null;
prestans.ui.TimeInput.prototype.secondField_		= null;
prestans.ui.TimeInput.prototype.show24Hours_		= null;
prestans.ui.TimeInput.prototype.lastChr_			= null;
prestans.ui.TimeInput.prototype.selectedHour_		= null;
prestans.ui.TimeInput.prototype.selectedMinute_	= null;
prestans.ui.TimeInput.prototype.selectedSecond_	= null;
prestans.ui.TimeInput.prototype.timeSteps_		= null;
prestans.ui.TimeInput.prototype.maxTime_			= null;
prestans.ui.TimeInput.prototype.minTime_			= null;
prestans.ui.TimeInput.prototype.defaultTime_		= null;
prestans.ui.TimeInput.prototype.field_			= null;

prestans.ui.TimeInput.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.DIV));
};

prestans.ui.TimeInput.prototype.decorateInternal = function(element) {

	prestans.ui.TimeInput.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, 'ss-widget-time-input');

	this.textBox_ = this.dom_.createElement(goog.dom.TagName.INPUT);
	this.textBox_.value = this.initialTime_;
	goog.dom.classes.add(this.textBox_, 'ss-widget-time-input-box');
	
	this.field_ = 0;
	element.appendChild(this.textBox_);

	this.eventHandler_.listen(this.textBox_, goog.events.EventType.FOCUS, this.textBoxGotFocus_, false, this);
	this.eventHandler_.listen(this.textBox_, goog.events.EventType.CLICK, this.textBoxWasClicked_, false, this);
	this.eventHandler_.listen(this.textBox_, goog.events.EventType.KEYDOWN, this.textBoxKeyDown_, false, this);
	this.eventHandler_.listen(this.textBox_, goog.events.EventType.KEYPRESS, this.textBoxKeyPressed_, false, this);
	
};

prestans.ui.TimeInput.prototype.textBoxGotFocus_ = function(event) {
	this.showField();
};

prestans.ui.TimeInput.prototype.textBoxWasClicked_ = function(event) {
	
	var fieldSize = this.separator_.length + 2;
	this.field_ = 0;
	
	if (this.textBox_.selectionStart != null) { // Use input select range
		for (var field = 0; field <= Math.max(1, this.secondField_, this.ampmField_);field++) {
			var end = (field != this.ampmField_ ? (field * fieldSize) + 2 : (this.ampmField_ * fieldSize) + this.ampmPrefix_.length + this.ampmNames_[0].length);
			this.field_ = field;
			if (this.textBox_.selectionStart < end) {
				break;
			}
		}
	} else if (this.textBox_.createTextRange) { // Check against bounding boxes
		var range = this.textBox_.createTextRange();
		var convert = function(value) {
			return { thin: 2, medium: 4, thick: 6 }[value] || value || 0;
		};
		
		var offsetX = event.clientX + window.document.documentElement.scrollLeft - (this.textBox_.offsetLeft + parseInt(convert(this.textBox_.style.borderLeftWidth), 10)) - range.offsetLeft; // Position - left edge - alignment
		for (var field = 0; field <= Math.max(1, this.secondField_, this.ampmField_); field++) {
			var end = (field != this.ampmField_ ? (field * fieldSize) + 2 : this.ampmField_ * fieldSize + this.ampmPrefix_.length + this.ampmNames_[0].length); 
			range.collapse();
			range.moveEnd('character', end);
			this.field_ = field;
			if (offsetX < range.boundingWidth) { // And compare
        		break;
      		}
    	}
	}
	
	this.showField();
};

prestans.ui.TimeInput.prototype.textBoxKeyDown_ = function(event) {
	if (event.keyCode >= 48) { // >= '0'
		return true;
	}

 	switch (event.keyCode) {
		case 9:
			return (event.shiftKey ? this.changeField(-1, true) : this.changeField(+1, true));
		case 35: // Clear time on ctrl+end.
			if (event.ctrlKey) {
				this.setValue('');
			} else { // Last field on end.
				this.field = Math.max(1, this.secondField, this.ampmField);
				this.adjustField(0);
			}
      		break;
		case 36:
			if (event.ctrlKey) { // Current time on ctrl+home.
				this.setTime();
			} else { // First field on home.
				this.field = 0;
				this.adjustField(0);
			}
			break;
		case 37: // Left.
			this.changeField(-1, false);
			break;
		case 38: // Up.
			this.adjustField(+1);
			break;
		case 39: // Right.
			this.changeField(+1, false);
			break;
		case 40: // Down.
			this.adjustField(-1);
			break;
		case 46: // Delete
			this.setValue('');
			break;
	}
	
	//event.preventDefault();
	return false;	
	
};

prestans.ui.TimeInput.prototype.textBoxKeyPressed_ = function(event) {
	event.preventDefault();
	var chr = String.fromCharCode((event.charCode == undefined) ? event.keyCode : event.charCode);
	if (chr < ' ') {
		return true;
	}
	this.handleKeyPress(chr);
	return false;
};


prestans.ui.TimeInput.prototype.showField = function() {
	var fieldSize = this.separator_.length + 2;
	var start = (this.field_ != this.ampmField_ ? (this.field_ * fieldSize) : (this.ampmField_ * fieldSize) - this.separator_.length + this.ampmPrefix_.length);
	var end = start + (this.field_ != this.ampmField_ ? 2 : this.ampmNames_[0].length);
	if (this.textBox_.setSelectionRange) { // Mozilla
		this.textBox_.setSelectionRange(start, end);
	} else if (this.textBox_.createTextRange) { // IE
		var range = this.textBox_.createTextRange();
		range.moveStart('character', start);
		range.moveEnd('character', end - this.textBox_.value.length);
		range.select();
	}
	this.textBox_.focus();
};

prestans.ui.TimeInput.prototype.handleKeyPress = function(chr) {

	if (chr == this.separator_) {
		this.changeField(+1, false);
	} else if (chr >= '0' && chr <= '9') {
		var key = parseInt(chr, 10);
		var value = parseInt(this.lastChr_ + chr, 10);
		var show24Hours = this.show24Hours_;
		var hour = (this.field_!= 0 ? this.selectedHour_ : (show24Hours ? (value < 24 ? value : key) : (value >= 1 && value <= 12 ? value : (key > 0 ? key : this.selectedHour_)) % 12 + (this.selectedHour_ >= 12 ? 12 : 0)));
		var minute = (this.field_!= 1 ? this.selectedMinute_ : (value < 60 ? value : key));
		var second = (this.field_!= this.secondField_ ? this.selectedSecond_ : (value < 60 ? value : key));
		var fields = this.constrainTime([hour, minute, second]);
		this.setTime(new Date(0, 0, 0, fields[0], fields[1], fields[2]));
		this.lastChr_ = chr;

	} else if (!this.show24Hours_) { // Set am/pm based on first char.
		var ampmNames = this.ampmNames_;
		if ((chr == ampmNames[0].substring(0, 1).toLowerCase() && this.selectedHour >= 12) || (chr == ampmNames[1].substring(0, 1).toLowerCase() && this.selectedHour < 12)) {
			var saveField = this.field;
			this.field_= this.ampmField;
			this.adjustField(+1);
			this.field_= saveField;
			this.showField();
		}
	}

};

prestans.ui.TimeInput.prototype.constrainTime = function(fields) {
	if (fields == null) {
		var now = this.determineTime(this.defaultTime_) || new Date();
		fields = [now.getHours(), now.getMinutes(), now.getSeconds()];
	}
	
	var reset = false;
	var timeSteps = this.timeSteps_;
	
	for (var i = 0; i < timeSteps.length; i++) {
		if (reset) {
			fields[i] = 0;
		} else if (timeSteps[i] > 1) {
			fields[i] = Math.round(fields[i] / timeSteps[i]) * timeSteps[i];
			reset = true;
		}
	}
	
	return fields;

};


prestans.ui.TimeInput.prototype.adjustField = function(offset) {
	if (this.textBox_.value == '') {
		offset = 0;
	}
	var steps = this.timeSteps_;
	this.setTime(new Date(0, 0, 0, this.selectedHour_ + (this.field_ == 0 ? offset * steps[0] : 0) + (this.field_ == this.ampmField_ ? offset * 12 : 0), this.selectedMinute_ + (this.field_ == 1 ? offset * steps[1] : 0), this.selectedSecond_ + (this.field_ == this.secondField ? offset * steps[2] : 0)));
};

prestans.ui.TimeInput.prototype.setValue = function(value) {
	if (value != this.textBox_.value) {
		this.textBox_.value = value;
	}
};

prestans.ui.TimeInput.prototype.setTime = function(time) {
	time = this.determineTime(time);
	var fields = this.constrainTime(time ? [time.getHours(), time.getMinutes(), time.getSeconds()] : null);
	time = new Date(0, 0, 0, fields[0], fields[1], fields[2]);
	var time = this.normaliseTime(time);
	var minTime = this.normaliseTime(this.determineTime(this.minTime_));
	var maxTime = this.normaliseTime(this.determineTime(this.maxTime_));
	time = (minTime && time < minTime ? minTime : (maxTime && time > maxTime ? maxTime : time));
	this.selectedHour_ = time.getHours();
	this.selectedMinute_ = time.getMinutes();
	this.selectedSecond_ = time.getSeconds();
	
	this.showTime();
	this.dispatchEvent(new goog.events.Event('SAFESHARPS_TIMESHEET_CHANGED'));
};

prestans.ui.TimeInput.prototype.extractTime = function() {
	var value = this.textBox_.value;
	var separator = this.separator_;
	var currentTime = value.split(separator);
	if (separator == '' && value != '') {
		currentTime[0] = value.substring(0, 2);
		currentTime[1] = value.substring(2, 4);
		currentTime[2] = value.substring(4, 6);
	}
	var ampmNames = this.ampmNames_;
	var show24Hours = this.show24Hours_;
	if (currentTime.length >= 2) {
		var isAM = !show24Hours && (value.indexOf(ampmNames[0]) > -1);
		var isPM = !show24Hours && (value.indexOf(ampmNames[1]) > -1);
		var hour = parseInt(currentTime[0], 10);
		hour = (isNaN(hour) ? 0 : hour);
		hour = ((isAM || isPM) && hour == 12 ? 0 : hour) + (isPM ? 12 : 0);
		var minute = parseInt(currentTime[1], 10);
		minute = (isNaN(minute) ? 0 : minute);
		var second = (currentTime.length >= 3 ?
			parseInt(currentTime[2], 10) : 0);
			second = (isNaN(second) || !this.showSeconds_ ? 0 : second);
			return this.constrainTime([hour, minute, second]);
	} 
	return null;
};

prestans.ui.TimeInput.prototype.getTotalHours = function() {
	var time_ = this.extractTime();
	var hours = time_[0] + (time_[1] / 60) + (time_[2] / 3600);
	
	return hours;
}

prestans.ui.TimeInput.prototype.extractTimeString = function() {
	var extractedTime = this.extractTime();
	return "" + extractedTime[0] + ":" + extractedTime[1] + ":" + extractedTime[2];
}

prestans.ui.TimeInput.prototype.determineTime = function(setting) {

	var offsetNumeric = function(offset) { // E.g. +300, -2
		var time = new Date();
		time.setTime(time.getTime() + offset * 1000);
		return time;
	};

	var offsetString = function(offset) { // E.g. '+2m', '-4h', '+3h +30m'

		var time = new Date();
		var hour = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();
		var pattern = /([+-]?[0-9]+)\s*(s|S|m|M|h|H)?/g;
		var matches = pattern.exec(offset);

		while (matches) {
			switch (matches[2] || 's') {
				case 's' : case 'S' :
					second += parseInt(matches[1], 10); break;
				case 'm' : case 'M' :
					minute += parseInt(matches[1], 10); break;
				case 'h' : case 'H' :
					hour += parseInt(matches[1], 10); break;
			}
			matches = pattern.exec(offset);
		}
		time = new Date(0, 0, 10, hour, minute, second, 0);
		if (/^!/.test(offset)) { // No wrapping
			if (time.getDate() > 10) {
				time = new Date(0, 0, 10, 23, 59, 59);
			}
			else if (time.getDate() < 10) {
				time = new Date(0, 0, 10, 0, 0, 0);
			}
		}
		return time;
	};
	return (setting ? (typeof setting == 'string' ? offsetString(setting) :
	(typeof setting == 'number' ? offsetNumeric(setting) : setting)) : null);

};

prestans.ui.TimeInput.prototype.normaliseTime = function(time) {
	if (!time) {
		return null;
	}
	time.setFullYear(1900);
	time.setMonth(0);
	time.setDate(0);
	return time;
};


prestans.ui.TimeInput.prototype.showTime = function() {
	var show24Hours = this.show24Hours_;
	var separator = this.separator_;
	var currentTime = (this.formatNumber(show24Hours ? this.selectedHour_ :
		((this.selectedHour_ + 11) % 12) + 1) + separator +
		this.formatNumber(this.selectedMinute_) +
		(this.showSeconds_ ? separator +
			this.formatNumber(this.selectedSecond_) : '') +
			(show24Hours ?  '' : this.ampmPrefix_ +
			this.ampmNames_[(this.selectedHour_ < 12 ? 0 : 1)]));
			this.setValue(currentTime);
			this.showField();
};

prestans.ui.TimeInput.prototype.formatNumber = function(value) {
  return (value < 10 ? '0' : '') + value;
};

prestans.ui.TimeInput.prototype.changeField = function(offset, moveOut) {
	var atFirstLast = (this.textBox_.value == '' || this.field_ == (offset == -1 ? 0 : Math.max(1, this.secondField_, this.ampmField_)));
	if (!atFirstLast) {
		this.field_ += offset;
	}

	this.showField();
	this.lastChr_ = '';
	
	return (atFirstLast && moveOut);
};

