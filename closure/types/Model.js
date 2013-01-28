//
// Copyright (c) 2013, Eternity Technologies Pty Ltd.
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
goog.provide('prestans.types.Model');
goog.provide('prestans.types.Model.EventType');
goog.provide('prestans.types.Model.ChangedEvent');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');

/**
 * @constructor
*/
prestans.types.Model = function() {
    goog.events.EventTarget.call(this);
};
goog.inherits(prestans.types.Model, goog.events.EventTarget);

prestans.types.Model.EventType = {
    CHANGED: 'prestans.types.Model.EventType.CHANGED'
};

/**
 * @constructor
 */
prestans.types.Model.ChangedEvent = function(eventType, identifier, previousValue, currentValue) {
	goog.events.Event.call (this, eventType);
	this.identifier_ = identifier;
	this.previousValue_ = previousValue;
	this.currentValue_ = currentValue;
};
goog.inherits(prestans.types.Model.ChangedEvent, goog.events.Event);

prestans.types.Model.ChangedEvent.prototype.identifier_	    = null;
prestans.types.Model.ChangedEvent.prototype.currentValue_	= null;
prestans.types.Model.ChangedEvent.prototype.previousValue_	= null;

prestans.types.Model.ChangedEvent.prototype.getIdentifier = function() {
	return this.identifier_;
};

prestans.types.Model.ChangedEvent.prototype.getCurrentValue = function() {
	return this.currentValue_;
};

prestans.types.Model.ChangedEvent.prototype.getPreviousValue = function() {
	return this.previousValue_;
};