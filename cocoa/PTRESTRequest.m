//
//  PTRESTRequest.m
//  prestans, Goodies for building REST clients in Cocoa
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


#import "PTRESTRequest.h"

@implementation PTRESTRequest

@synthesize identifier = __identifier;
@synthesize isMultipartRequest = __isMultipart;

@synthesize partialURL = __partialURL;
@synthesize httpMethod = __httpMethod;
@synthesize responseParser = __responseParser;


- (id) init 
{       
    self = [super init];
    if (self) {
        
        self.httpMethod = PTHTTPMethodGET;
        self.identifier = @"IdentifierNotSet";
        
        queryParameters = [[NSMutableDictionary alloc] init];
        postData = [[NSMutableDictionary alloc] init];
        
    }
    
    return self;
}


/**
 Inits a default object and sets up the HTTP method
 
 @param method accepts the HTTP method used for this request
 */
- (id) initWithHTTPMethod:(PTHTTPMethod *) method 
{
    self = [self init];
    if(self) {
        self.httpMethod = method;
    }
    
    return self;    
}

/**
 Sets Parameters value, these are sent as part of the URL
 
 @param value a Foundation object that will be sent in the URL
 @param key is a string that the API expects
 */

- (void) setParamValue:(id) value 
                forKey:(NSString *) key
{
    [queryParameters setValue:value forKey:key];
}

/**
 Set an object to be sent out in the POST body
 
 @param value a Foundation object that will be sent in the URL
 @param key is a string that the API expects
 */

- (void) setBodyValue:(id) value 
               forKey:(NSString *) key
{
    [postData setValue:value forKey:key];
}


/**
 Returns an ECRequest into an NSMutableURLRequest, this is
 primarily called by ECAPIClient
 */

- (NSMutableURLRequest *) urlRequest:(NSString *) baseURL
{

    NSMutableString *finalURLString = [[NSMutableString alloc] initWithFormat:@"%@%@/?", 
                                       baseURL,
                                       self.partialURL];
    
    /**
     * Parameters 
     */
    for(id paramKey in queryParameters) {
        /* If object is a class then loop through the elements */
        if([[queryParameters objectForKey:paramKey] isKindOfClass:[NSArray class]]) {
            for(id aValue in [queryParameters objectForKey:paramKey]) {
                [finalURLString appendFormat:@"&%@=%@", paramKey, aValue];
            }
        }
        else 
            [finalURLString appendFormat:@"&%@=%@", paramKey, [queryParameters objectForKey:paramKey]];
    }
    
    NSURL *url = [NSURL URLWithString:finalURLString];
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:url];
    
    NSMutableURLRequest *urlRequest = [[NSMutableURLRequest alloc] initWithURL:url 
                                                                   cachePolicy:NSURLCacheStorageAllowed 
                                                               timeoutInterval:60.0];
    [urlRequest setHTTPShouldHandleCookies:YES];
    
    /* Choose appropriate HTTP method for the request */
    if(self.httpMethod == PTHTTPMethodGET) [urlRequest setHTTPMethod:@"GET"];
    else if(self.httpMethod == PTHTTPMethodPOST) [urlRequest setHTTPMethod:@"POST"];
    else if(self.httpMethod == PTHTTPMethodPUT) [urlRequest setHTTPMethod:@"PUT"];
    else if(self.httpMethod == PTHTTPMethodDELETE) [urlRequest setHTTPMethod:@"DELETE"];
    
    /**
     * Convert POST data to string 
     */
    if(postData) {          
        NSMutableString *httpBodyString = [[NSMutableString alloc] init];
        for(id postDataKey in postData) {
            [httpBodyString appendFormat:@"%@=%@&", postDataKey, [postData objectForKey:postDataKey]];
        }
        [urlRequest setHTTPBody:[NSData dataWithBytes:[httpBodyString UTF8String] length:[httpBodyString length]]];
    }
    
    NSLog(@"[PTRequest/APIRequest/%@] %@", [urlRequest HTTPMethod], finalURLString);
    return urlRequest;
    
}


@end
