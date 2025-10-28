import Foundation
import React

@objc(FastNativeImageViewManager)
class FastNativeImageViewManager: RCTViewManager {
  
  override func view() -> UIView! {
	return FastNativeImageView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
	return true
  }
}
