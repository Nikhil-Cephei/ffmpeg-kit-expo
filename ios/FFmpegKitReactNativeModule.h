#import <Foundation/Foundation.h>
#import <ffmpegkit/FFmpegKitConfig.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <FFmpegKitReactNativeSpec/FFmpegKitReactNativeSpec.h>
#import <React/RCTEventEmitter.h>

@interface FFmpegKitReactNativeModule : RCTEventEmitter <NativeFFmpegKitReactNativeModuleSpec>

#else

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface FFmpegKitReactNativeModule : RCTEventEmitter<RCTBridgeModule>

#endif

@end
