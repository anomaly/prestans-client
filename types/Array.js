//
// Copyright (c) 2014, Eternity Technologies Pty Ltd.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of Eternity Technologies nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL ETERNITY TECHNOLOGIES BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

goog.provide('prestans.types.Array');

goog.require('goog.array');
goog.require('goog.iter');
goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');
goog.require('goog.json');

goog.require('prestans.types.Boolean');
goog.require('prestans.types.Float');
goog.require('prestans.types.Integer');
goog.require('prestans.types.Model');
goog.require('prestans.types.String');

/**
 * @constructor
 */
prestans.types.ArrayIterator = function(array) {
  this.array_ = array;
  this.currentIndex_ = 0;
};
goog.inherits(prestans.types.ArrayIterator, goog.iter.Iterator);

prestans.types.ArrayIterator.prototype.array_			= null;
prestans.types.ArrayIterator.prototype.currentIndex_ 	= null;

prestans.types.ArrayIterator.prototype.next = function() {
  if (this.currentIndex_ >= this.array_.length())
    throw goog.iter.StopIteration;
  else
    return this.array_.objectAtIndex(this.currentIndex_++);
};

/**
 * @constructor
 */
prestans.types.Array = function(config) {

	//Check that element template exists
	if (!goog.isDef(config.elementTemplate))
		throw "No element template was supplied for Array";
	
	//Check that element template is of an acceptable type
	if(config.elementTemplate != prestans.types.Boolean &&
	   config.elementTemplate != prestans.types.Float &&
	   config.elementTemplate != prestans.types.Integer &&
	   config.elementTemplate != prestans.types.String &&
	   !(new config.elementTemplate() instanceof prestans.types.Model))
		throw "Element template is not an acceptable type";

	this.elementTemplate_ = config.elementTemplate;
	this.elements_ = new Array();
	
	//Add elements if passed in
	if(goog.isDef(config.opt_elements) && goog.isArray(config.opt_elements)) {

		goog.array.forEach(config.opt_elements, function(element) {

			//Check that given value is of passed type
			if(goog.isString(element) && this.elementTemplate_ == prestans.types.String)
				goog.array.insertAt(this.elements_, element, this.elements_.length);
			else if(goog.isBoolean(element) && this.elementTemplate_ == prestans.types.Boolean)
				goog.array.insertAt(this.elements_, element, this.elements_.length);
			else if(goog.isNumber(element) && this.elementTemplate_ == prestans.types.Float)
				goog.array.insertAt(this.elements_, element, this.elements_.length);
			else if(goog.isNumber(element) && this.elementTemplate_ == prestans.types.Integer)
				goog.array.insertAt(this.elements_, element, this.elements_.length);
			else if (element instanceof this.elementTemplate_)
				goog.array.insertAt(this.elements_, element, this.elements_.length);
			else
				throw "Element was not of element template type";

		}, this);

	}
	//Alternatively add json but not both
	else if(goog.isDef(config.opt_json) && goog.isArray(config.opt_json)) {

		goog.array.forEach(config.opt_json, function(elementJSON) {

			//Check that given value is of passed type
			if(goog.isString(elementJSON) && this.elementTemplate_ == prestans.types.String)
				goog.array.insertAt(this.elements_, elementJSON, this.elements_.length);
			else if(goog.isBoolean(elementJSON) && this.elementTemplate_ == prestans.types.Boolean)
				goog.array.insertAt(this.elements_, elementJSON, this.elements_.length);
			else if(goog.isNumber(elementJSON) && this.elementTemplate_ == prestans.types.Float)
				goog.array.insertAt(this.elements_, elementJSON, this.elements_.length);
			else if(goog.isNumber(elementJSON) && this.elementTemplate_ == prestans.types.Integer)
				goog.array.insertAt(this.elements_, elementJSON, this.elements_.length);
			else if(new this.elementTemplate_() instanceof prestans.types.Model)
				goog.array.insertAt(this.elements_, new this.elementTemplate_(elementJSON, config.opt_minified), this.elements_.length);
			else
				throw "Element was not of element template type";

		}, this);

	}

	if(goog.isDef(config.maxLength) && config.maxLength != null)
		this.maxLength_ = config.maxLength;

	if(goog.isDef(config.minLength) && config.minLength != null)
		this.minLength_ = config.minLength;
};

prestans.types.Array.prototype.elements_ 			= null;
prestans.types.Array.prototype.elementTemplate_ 	= null;
prestans.types.Array.prototype.maxLength_ 			= null;
prestans.types.Array.prototype.minLength_ 			= null;

prestans.types.Array.prototype.getMinLength = function() {
	return this.minLength_;
};

prestans.types.Array.prototype.getMaxLength = function() {
	return this.maxLength_;
};

prestans.types.Array.prototype.isEmpty = function() {
	return goog.array.isEmpty(this.elements_);
};

prestans.types.Array.prototype.isValid = function() {

	//Check max length
	if(this.maxLength_ != null && this.elements_.length > this.maxLength_)
		return false;

	//Check min length
	if(this.minLength_ != null && this.elements_.length < this.minLength_)
		return false;

	return true;
};

prestans.types.Array.prototype.append = function(value) {

	//Check supported types
	if(goog.isString(value) && this.elementTemplate_ == prestans.types.String) {
		goog.array.insertAt(this.elements_, value, this.elements_.length);
		return true;
	}
	else if(goog.isBoolean(value) && this.elementTemplate_ == prestans.types.Boolean) {
		goog.array.insertAt(this.elements_, value, this.elements_.length);
		return true;
	}
	else if(goog.isNumber(value) && this.elementTemplate_ == prestans.types.Float) {
		goog.array.insertAt(this.elements_, value, this.elements_.length);
		return true;
	}
	else if(goog.isNumber(value) && this.elementTemplate_ == prestans.types.Integer) {
		goog.array.insertAt(this.elements_, value, this.elements_.length);
		return true;
	}
	else if(value instanceof this.elementTemplate_) {
		goog.array.insertAt(this.elements_, value, this.elements_.length);
		return true;
	}

	//Unsupported type
	return false;
};

prestans.types.Array.prototype.binarySearch = function(element, compare) {
	return goog.array.binarySearch(this.elements_, element, compare);
};

prestans.types.Array.prototype.binaryInsert = function(element, compare) {
	return goog.array.binaryInsert(this.elements_, element, compare);
};

prestans.types.Array.prototype.binaryRemove = function(element, compare) {
	return goog.array.binaryRemove(this.elements_, element, compare);
};

prestans.types.Array.prototype.insertAt = function(value, index) {
	
	//Check supported types
	if(goog.isString(value) && this.elementTemplate_ == prestans.types.String) {
		goog.array.insertAt(this.elements_, value, index);
		return true;
	}
	else if(goog.isBoolean(value) && this.elementTemplate_ == prestans.types.Boolean) {
		goog.array.insertAt(this.elements_, value, index);
		return true;
	}
	else if(goog.isNumber(value) && this.elementTemplate_ == prestans.types.Float) {
		goog.array.insertAt(this.elements_, value, index);
		return true;
	}
	else if(goog.isNumber(value) && this.elementTemplate_ == prestans.types.Integer) {
		goog.array.insertAt(this.elements_, value, index);
		return true;
	}
	else if(value instanceof this.elementTemplate_) {
		goog.array.insertAt(this.elements_, value, index);
		return true;
	}

	//Unsupported type
	return false;	
};

prestans.types.Array.prototype.insertAfter = function(newValue, existingValue) {

	if(!goog.array.contains(this.elements_, existingValue))
		return false;

	var indexToInsert_ = goog.array.indexOf(this.elements_, existingValue) + 1;

	//Check supported types
	if(this.elementTemplate_ == prestans.types.String && goog.isString(newValue))
		goog.array.insertAt(this.elements_, newValue, indexToInsert_);
	else if(this.elementTemplate_ == prestans.types.Boolean && goog.isBoolean(newValue))
		goog.array.insertAt(this.elements_, newValue, indexToInsert_);
	else if(this.elementTemplate_ == prestans.types.Float && goog.isNumber(newValue))
		goog.array.insertAt(this.elements_, newValue, indexToInsert_);
	else if(this.elementTemplate_ == prestans.types.Integer && goog.isNumber(newValue))
		goog.array.insertAt(this.elements_, newValue, indexToInsert_);
	else if(newValue instanceof this.elementTemplate_)
		goog.array.insertAt(this.elements_, newValue, indexToInsert_);
	else
		return false;

	return true;

};


prestans.types.Array.prototype.indexOf = function(object, opt_fromIndex) {
	return goog.array.indexOf(this.elements_, object, opt_fromIndex);
};

prestans.types.Array.prototype.removeIf = function(condition, opt_context) {
	return goog.array.removeIf(this.elements_, condition, opt_context);
};

prestans.types.Array.prototype.remove = function(value) {
	return goog.array.remove(this.elements_, value);
};

prestans.types.Array.prototype.length = function() {
	return this.elements_.length;
};

prestans.types.Array.prototype.sort = function(sortFunction) {
	goog.array.sort(this.elements_, sortFunction);
};

prestans.types.Array.prototype.clear = function() {
	goog.array.clear(this.elements_);
};

prestans.types.Array.prototype.find = function(condition, opt_context) {
	return goog.array.find(this.elements_, condition, opt_context);
};

prestans.types.Array.prototype.slice = function(start, opt_end) {
	var sliced_ = goog.array.slice(this.elements_, start, opt_end);

	return new prestans.types.Array({
		elementTemplate: this.elementTemplate_,
		opt_elements: sliced_
	});
};

prestans.types.Array.prototype.contains = function(element) {
	return goog.array.contains(this.elements_, element);
};

prestans.types.Array.prototype.containsIf = function(condition, opt_context) {
	return goog.array.find(this.elements_, condition, opt_context) != null;
};

prestans.types.Array.prototype.objectAtIndex = function(index) {
	return this.elements_[index];
};

prestans.types.Array.prototype.asArray = function() {

	var array_ = new Array();

	goog.array.forEach(this.elements_, function(element) {

	//Check that element template is a basic type
	if(this.elementTemplate_ == prestans.types.String ||
	   this.elementTemplate_ == prestans.types.Integer ||
	   this.elementTemplate_ == prestans.types.Float ||
	   this.elementTemplate_ == prestans.types.Boolean)
		goog.array.insertAt(array_, element, array_.length);
	else if (new this.elementTemplate_() instanceof prestans.types.Model)
		goog.array.insertAt(array_, new this.elementTemplate_(element.getJSONObject()), array_.length);

	}, this);

	return array_;
};

prestans.types.Array.prototype.clone = function(opt_filter) {

	var clone_ = new prestans.types.Array({
		elementTemplate: this.elementTemplate_,
		maxLength: this.maxLength_,
		minLength: this.minLength_
	});

	goog.array.forEach(this.elements_, function(element) {
			if(this.elementTemplate_ == prestans.types.String ||this.elementTemplate_ == prestans.types.Integer || this.elementTemplate_ == prestans.types.Float || this.elementTemplate_ == prestans.types.Boolean)
				clone_.append(element);
			else if(new this.elementTemplate_() instanceof prestans.types.Model)
				clone_.append(element.clone(opt_filter));
	}, this);

	return clone_;
};

prestans.types.Array.prototype.__iterator__ = function(){
	return new prestans.types.ArrayIterator(this);
};

prestans.types.Array.prototype.getElementTemplate = function(){
	return this.elementTemplate_;
};

prestans.types.Array.prototype.getJSONObject = function(opt_filter) {
	var jsonifiedArray_ = new Array();

	goog.array.forEach(this.elements_, function(element) {

	//Check that element template is a basic type
	if(this.elementTemplate_ == prestans.types.String ||
	   this.elementTemplate_ == prestans.types.Integer ||
	   this.elementTemplate_ == prestans.types.Float ||
	   this.elementTemplate_ == prestans.types.Boolean)
		goog.array.insertAt(jsonifiedArray_, element, jsonifiedArray_.length);
	else if (new this.elementTemplate_() instanceof prestans.types.Model)
		goog.array.insertAt(jsonifiedArray_, element.getJSONObject(opt_filter), jsonifiedArray_.length);

	}, this);

	return jsonifiedArray_;
};

prestans.types.Array.prototype.getJSONString = function() {
	return goog.json.serialize(this.getJSONObject());
};