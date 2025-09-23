import UIKit
import React

@objc(VideoPlayerViewManager)
class VideoPlayerViewManager: RCTViewManager {
	
	override func view() -> UIView! {
		return VideoPlayerView()
	}
	
	@objc override static func requiresMainQueueSetup() -> Bool {
		return true
	}
}
