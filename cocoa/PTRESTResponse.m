//
//  PTRESTResponse.m
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

#import "PTRESTResponse.h"

@implementation PTRESTResponse


@synthesize httpStatus = __httpStatus;
@synthesize identifier = __identifier;

@synthesize statusMessage = __statusMessage;
@synthesize delegate = __delegate;
@synthesize parserClass = __parserClass;

- (id)init
{
    self = [super init];
    if (self) {
        responseData = [[NSMutableData alloc] init];
    }
    
    return self;
}


#pragma mark - Connection Delegate

- (void) connection:(NSURLConnection *)connection didFailWithError:(NSError *)error 
{       
    NSLog(@"[PTRESTResponse/didFailWithError/%@] Status Code %i, Response is %i characters long", 
          self.identifier, 
          self.httpStatus, 
          [responseData length]);
    
    self.statusMessage = [[NSString alloc] initWithData:responseData encoding:NSASCIIStringEncoding];
    [self.delegate apiRequestFailedWithResponse:self];  
}

- (void) connectionDidFinishLoading:(NSURLConnection *)connection {
    
    NSLog(@"[PTRESTResponse/connectionDidFinishLoading/%@] Status Code %i, Response is %i characters long", 
          self.identifier, 
          self.httpStatus, [responseData length]);
    
    if(self.httpStatus == PTHTTPStatusOK || self.httpStatus == PTHTTPStatusCreated) {
        
        NSError *error = nil;
        NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData:responseData 
                                                                     options:NSJSONReadingAllowFragments 
                                                                       error:&error];
        
        if(!error) {
                
            [self interpretJSONResponse:jsonResponse];
            
            [self.delegate apiRequestFinishedWithResponse:self];
            
        }
        else {
            
            /* Can't parse the JSON */
            
        }
        
    }
    else {
        self.statusMessage = [[NSString alloc] initWithData:responseData encoding:NSASCIIStringEncoding];
    }
    
}

#pragma mark - Data Delegate

- (void) connection:(NSURLConnection *)connection didReceiveResponse:(NSHTTPURLResponse *)response 
{
    self.httpStatus = [response statusCode];
}

- (void) connection:(NSURLConnection *)connection didReceiveData:(NSData *)data 
{
    [responseData appendData:data];
}

#pragma mark - Override these

- (void) interpretJSONResponse:(NSDictionary *) jsonResponse {
    
    /* Doesn't do a thing */

}


@end
