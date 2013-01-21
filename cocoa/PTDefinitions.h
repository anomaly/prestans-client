//
//  PTDefinitions.h
//  prestans, WSGI Goodies for Objective-C
//  http://prestans.googlecode.com
//
//  Copyright (c) 2012, Eternity Technologies Pty Ltd.
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
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

#import <Foundation/Foundation.h>

typedef NSString                            PTHTTPMethod;

#define PTHTTPMethodGET                     @"GET"
#define PTHTTPMethodPOST                    @"POST"
#define PTHTTPMethodPUT                     @"PUT"
#define PTHTTPMethodDELETE                  @"DELETE"

/**
 Error codes that might be returned by the server 
 */

typedef NSInteger                           PTHTTPStatus;

#define PTHTTPStatusOK                      200
#define PTHTTPStatusCreated                 201
#define PTHTTPStatusBadRequest              400
#define PTHTTPStatusForbidden               403
#define PTHTTPStatusNotFound                404
#define PTHTTPStatusServerError             500
#define PTHTTPStatusServiceUnavailable      503

/**
 Response Delegate Protocol is implemented by classes that allow 
 */
@protocol PTResponseDelegate <NSObject>

/**
 Called if all went well, this fires the parse method
 
 @param response A fully formed and parsed Cocoa compliant resposne
 */
- (void) apiRequestFinishedWithResponse:(id) response;

/**
 Called if the API request didn't finish
 
 @param response An EtsyCocoa response object containing details about the failure
 */
- (void) apiRequestFailedWithResponse:(id) response;

/** 
 Called if the API request returned an error 
 
 @param response An EtsyCocoa response object containing details about the error
 */
- (void) apiReturnedError:(PTHTTPStatus) status 
           resposneString:(id) response;

@end


@protocol PTResponseParser

- (id) initWithJSON:(id) jsonObject;

@end