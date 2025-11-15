import UserNotifications
import UIKit

class NotificationService: UNNotificationServiceExtension {
	
	var contentHandler: ((UNNotificationContent) -> Void)?
	var bestAttemptContent: UNMutableNotificationContent?
	
	override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
		print("NotificationService: Received notification request")
		
		self.contentHandler = contentHandler
		bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
		
		if let bestAttemptContent = bestAttemptContent {
			// Increment badge count first
			incrementBadgeCount(for: bestAttemptContent)
			
			var imageURLString: String?
			
			// Check various possible locations for image URL
			if let imageURL = bestAttemptContent.userInfo["image"] as? String {
				imageURLString = imageURL
				print("NotificationService: Found image URL in 'image' field")
			} else if let fcmOptions = bestAttemptContent.userInfo["fcm_options"] as? [String: Any],
					  let imageURL = fcmOptions["image"] as? String {
				imageURLString = imageURL
				print("NotificationService: Found image URL in 'fcm_options.image' field")
			} else if let apsDict = bestAttemptContent.userInfo["aps"] as? [String: Any],
					  let imageURL = apsDict["image"] as? String {
				imageURLString = imageURL
				print("NotificationService: Found image URL in 'aps.image' field")
			} else if let imageURL = bestAttemptContent.userInfo["imageUrl"] as? String {
				imageURLString = imageURL
				print("NotificationService: Found image URL in 'imageUrl' field")
			} else if let imageURL = bestAttemptContent.userInfo["image_url"] as? String {
				imageURLString = imageURL
				print("NotificationService: Found image URL in 'image_url' field")
			} else {
				print("NotificationService: No image URL found in notification payload")
			}
			
			if let imageURLString = imageURLString,
			   let imageURL = URL(string: imageURLString) {
				
				print("NotificationService: Starting image download from \(imageURL)")
				downloadImage(from: imageURL) { [weak self] (attachment) in
					if let attachment = attachment {
						bestAttemptContent.attachments = [attachment]
						print("NotificationService: Image attachment added successfully")
					} else {
						print("NotificationService: Failed to create image attachment")
					}
					contentHandler(bestAttemptContent)
				}
			} else {
				// No image URL found, deliver notification as is
				print("NotificationService: Delivering notification without image")
				contentHandler(bestAttemptContent)
			}
		} else {
			print("NotificationService: Failed to create mutable notification content")
			contentHandler(request.content)
		}
	}
	
	override func serviceExtensionTimeWillExpire() {
		print("NotificationService: Service extension time will expire")
		if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
			contentHandler(bestAttemptContent)
		}
	}
	
	private func downloadImage(from url: URL, completion: @escaping (UNNotificationAttachment?) -> Void) {
		print("NotificationService: Starting download task for \(url)")
		
		let task = URLSession.shared.downloadTask(with: url) { (location, response, error) in
			guard let location = location else {
				print("NotificationService: Failed to download image: \(error?.localizedDescription ?? "Unknown error")")
				completion(nil)
				return
			}
			
			print("NotificationService: Image downloaded successfully")
			
			// Get file extension from URL or response
			var fileExtension = url.pathExtension
			if fileExtension.isEmpty {
				if let mimeType = response?.mimeType {
					switch mimeType {
					case "image/jpeg", "image/jpg":
						fileExtension = "jpg"
					case "image/png":
						fileExtension = "png"
					case "image/gif":
						fileExtension = "gif"
					case "image/webp":
						fileExtension = "webp"
					default:
						fileExtension = "jpg"
					}
					print("NotificationService: Determined file extension '\(fileExtension)' from MIME type '\(mimeType)'")
				} else {
					fileExtension = "jpg"
					print("NotificationService: Using default file extension 'jpg'")
				}
			} else {
				print("NotificationService: Using file extension '\(fileExtension)' from URL")
			}
			
			// Create temporary file URL
			let tempDirectory = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
			let fileName = UUID().uuidString + "." + fileExtension
			let tempFileURL = tempDirectory.appendingPathComponent(fileName)
			
			print("NotificationService: Creating temporary file at \(tempFileURL)")
			
			do {
				// Move downloaded file to temp location
				try FileManager.default.moveItem(at: location, to: tempFileURL)
				
				// Create notification attachment
				let attachment = try UNNotificationAttachment(
					identifier: "image",
					url: tempFileURL,
					options: [
						UNNotificationAttachmentOptionsTypeHintKey: self.getTypeHint(for: fileExtension)
					]
				)
				
				print("NotificationService: Notification attachment created successfully")
				completion(attachment)
			} catch {
				print("NotificationService: Failed to create notification attachment: \(error.localizedDescription)")
				completion(nil)
			}
		}
		
		task.resume()
	}
	
	private func getTypeHint(for fileExtension: String) -> String {
		let typeHint: String
		switch fileExtension.lowercased() {
		case "jpg", "jpeg":
			typeHint = "public.jpeg"
		case "png":
			typeHint = "public.png"
		case "gif":
			typeHint = "com.compuserve.gif"
		case "webp":
			typeHint = "public.webp"
		default:
			typeHint = "public.jpeg"
		}
		
		print("NotificationService: Using type hint '\(typeHint)' for extension '\(fileExtension)'")
		return typeHint
	}
	
	private func incrementBadgeCount(for content: UNMutableNotificationContent) {
		guard let sharedDefaults = UserDefaults(suiteName: "group.mezon.mobile") else {
			content.badge = NSNumber(value: 1)
			return
		}
		
		let currentBadgeCount = sharedDefaults.integer(forKey: "badgeCount")
		let newBadgeCount = currentBadgeCount + 1
		
		
		sharedDefaults.set(newBadgeCount, forKey: "badgeCount")
		sharedDefaults.synchronize()
		
		content.badge = NSNumber(value: newBadgeCount)
	}
}
