import Foundation
import React

@objc(BadgeModule)
class BadgeModule: NSObject {
  @objc
  func setBadgeCount(_ count: NSNumber) {
	print("BadgeModule: Setting badge count to \(count)")
	
	DispatchQueue.main.async {
	  UIApplication.shared.applicationIconBadgeNumber = count.intValue
	  
	  // Also save to UserDefaults for consistency
	  guard let sharedDefaults = UserDefaults(suiteName: "group.mezon.mobile") else {
		print("BadgeModule: Failed to get UserDefaults for suite name")
		return
	  }
	  
	  sharedDefaults.set(count.intValue, forKey: "badgeCount")
	  sharedDefaults.synchronize()
	  print("BadgeModule: Badge count set to \(count) and saved to UserDefaults")
	}
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
	print("BadgeModule: requiresMainQueueSetup called")
	return false // Changed to false since we handle main queue manually
  }
}
