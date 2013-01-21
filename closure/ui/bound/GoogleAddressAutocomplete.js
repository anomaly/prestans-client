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

goog.provide('prestans.ui.bound.GoogleAddressAutocomplete');

goog.require('goog.events.EventHandler');
goog.require('goog.events.InputHandler');

/**
 * @constructor
 */
prestans.ui.bound.GoogleAddressAutocomplete = function(opt_domHelper, definition) {
	
    goog.ui.Component.call(this, opt_domHelper);
    
    if (definition)
		this.definition_ = definition;
	else 
		throw "No definition was supplied for GoogleAddressAutocomplete";

	this.valid_ = false;
	//this.eventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(prestans.ui.bound.GoogleAddressAutocomplete, goog.ui.Component);

prestans.ui.bound.GoogleAddressAutocomplete.prototype.definition_    = null;
prestans.ui.bound.GoogleAddressAutocomplete.prototype.valid_         = null;

prestans.ui.bound.GoogleAddressAutocomplete.prototype.createDom = function() {
	this.decorateInternal(this.dom_.createElement(goog.dom.TagName.INPUT));
};

prestans.ui.bound.GoogleAddressAutocomplete.prototype.decorateInternal = function(element) {
    
    prestans.ui.bound.GoogleAddressAutocomplete.superClass_.decorateInternal.call(this, element);
	goog.dom.classes.add(element, "prestans-ui-bound-googleaddressautocomplete");

    /* Google maps autocomplete */
    var autoCompleteOptions_ = { 
        "types": ['geocode'] 
    };
    
    var autocomplete_ = new google.maps.places.Autocomplete(element, autoCompleteOptions_);
    google.maps.event.addListener(autocomplete_, 'place_changed', goog.bind(function() {
        var place_ = autocomplete_.getPlace();
        
        var address_ =  place_['formatted_address'];
        var latitude_ = place_['geometry']['location'].lat();
        var longitude_ = place_['geometry']['location'].lng();
        
        this.changed_(address_, latitude_, longitude_);
        
    }, this));
    
    var address_ = this.definition_.boundAddressGetter();
    var latitude_ = this.definition_.boundLatitudeGetter();
    var longitude_ = this.definition_.boundLongitudeGetter();
    element.value = address_;
    
    this.changed_(address_, latitude_, longitude_);
};

prestans.ui.bound.GoogleAddressAutocomplete.prototype.changed_ = function(address, latitude, longitude) {

    this.valid_ = this.callModelSetter_(address, latitude, longitude);

    if(this.valid_)
        goog.dom.classes.remove(this.getElement(), "prestans-ui-bound-form-error");
    else
        goog.dom.classes.add(this.getElement(), "prestans-ui-bound-form-error");

    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
};

prestans.ui.bound.GoogleAddressAutocomplete.prototype.callModelSetter_ = function(address, latitude, longitude) {

    if(this.definition_.boundAddressSetter && this.definition_.boundLatitudeSetter && this.definition_.boundLongitudeSetter)
        return this.definition_.boundAddressSetter(address) && this.definition_.boundLatitudeSetter(latitude) && this.definition_.boundLongitudeSetter(longitude);
    
    //Always invalid if no bound setter was provided
    return false;
};

prestans.ui.bound.GoogleAddressAutocomplete.prototype.isValid = function() {
    return this.valid_;
};