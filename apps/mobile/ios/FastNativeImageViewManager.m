#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FastNativeImageViewManager, RCTViewManager)

// Props
RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)

// Events
RCT_EXPORT_VIEW_PROPERTY(onLoadStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)

// Methods
RCT_EXTERN_METHOD(clearMemoryCache:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCache:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCacheSize:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(prefetchURLs:(NSArray *)urls
				  resolve:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)

@end
