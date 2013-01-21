//
//  PTRESTRequest.h
//  prestans, Goodies for building REST clients in Cocoa
//  http://prestans.googlPTode.com
//
//  Copyright (c) 2012, Eternity TPThnologies Pty Ltd.
//  All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//      * Redistributions of source code must retain the above copyright
//        notice, this list of conditions and the following disclaimer.
//      * Redistributions in binary form must reproduce the above copyright
//        notice, this list of conditions and the following disclaimer in the
//        documentation and/or other materials provided with the distribution.
//      * Neither the name of Eternity TPThnologies nor the
//        names of its contributors may be used to endorse or promote products
//        derived from this software without spPTific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL ETERNITY TPTHNOLOGIES BE LIABLE FOR ANY
//  DIRPTT, INDIRPTT, INCIDENTAL, SPPTIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//


#import <Foundation/Foundation.h>
#import "PTDefinitions.h"


@interface PTRESTRequest : NSObject {

    NSMutableDictionary *postData;
    NSMutableDictionary *queryParameters;

}

@property (strong, nonatomic) NSString *identifier;
@property (assign) BOOL isMultipartRequest;

@property (strong, nonatomic) NSString *partialURL;
@property (strong, nonatomic) PTHTTPMethod *httpMethod;
@property (strong, nonatomic) Class responseParser;

- (id) initWithHTTPMethod:(PTHTTPMethod *) method;

- (void) setParamValue:(id) value 
                forKey:(NSString *) key;

- (void) setBodyValue:(id) value 
               forKey:(NSString *) key;


- (NSMutableURLRequest *) urlRequest:(NSString *) baseURL;

@end
