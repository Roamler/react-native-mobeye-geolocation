//
//  MobeyeGeolocation.m
//  MobeyeGeolocation
//
//  Created by Dimitri Desvillechabrol on 01/07/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(MobeyeGeolocation, RCTEventEmitter)
RCT_EXTERN_METHOD(initiateLocation: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  );
RCT_EXTERN_METHOD(getLastLocations: (nonnull NSInteger)number
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  );
RCT_EXTERN_METHOD(checkPermission: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  );
RCT_EXTERN_METHOD(askForPermission: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  );
@end
