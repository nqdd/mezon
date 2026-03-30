#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BadgeModule, NSObject)

RCT_EXTERN_METHOD(setBadgeCount:(nonnull NSNumber *)count)

@end
