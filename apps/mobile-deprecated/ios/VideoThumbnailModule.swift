import React
import AVFoundation
import UIKit
import CryptoKit

@objc(VideoThumbnailModule)
class VideoThumbnailModule: NSObject {
  
  // Memory cache for thumbnails with size management
  private static let memoryCache: NSCache<NSString, UIImage> = {
	let cache = NSCache<NSString, UIImage>()
	cache.totalCostLimit = 100 * 1024 * 1024 // 100MB limit
	return cache
  }()
  
  // File manager for disk cache
  private static let fileManager = FileManager.default
  
  // Cache directory
  private static var cacheDirectory: URL? = {
	guard let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
	  return nil
	}
	let cacheDir = documentsDirectory.appendingPathComponent("VideoThumbnailCache")
	
	// Create cache directory if it doesn't exist
	if !fileManager.fileExists(atPath: cacheDir.path) {
	  try? fileManager.createDirectory(at: cacheDir, withIntermediateDirectories: true, attributes: nil)
	}
	
	return cacheDir
  }()
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
	return false
  }
  
  @objc
  func getThumbnail(_ videoUrl: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
	
	// Validate URL
	guard let url = URL(string: videoUrl) else {
	  rejecter("INVALID_URL", "Invalid video URL provided", nil)
	  return
	}
	
	let cacheKey = generateCacheKey(from: videoUrl)
	
	// Check memory cache first
	if let cachedImage = VideoThumbnailModule.memoryCache.object(forKey: cacheKey as NSString) {
	  let result = createResultDictionary(from: cachedImage)
	  resolver(result)
	  return
	}
	
	// Check disk cache
	if let cachedImage = loadFromDiskCache(cacheKey: cacheKey) {
	  // Store in memory cache for faster future access with cost calculation
	  let imageSizeInBytes = calculateImageSizeInBytes(cachedImage)
	  VideoThumbnailModule.memoryCache.setObject(cachedImage, forKey: cacheKey as NSString, cost: imageSizeInBytes)
	  let result = createResultDictionary(from: cachedImage)
	  resolver(result)
	  return
	}
	
	// Generate new thumbnail if not cached
	generateThumbnail(from: url, cacheKey: cacheKey, resolver: resolver, rejecter: rejecter)
  }
  
  // MARK: - Private Methods
  
  private func generateCacheKey(from videoUrl: String) -> String {
	// Create a unique cache key based on the video URL
	let data = videoUrl.data(using: .utf8) ?? Data()
	let hash = data.sha256
	return hash
  }
  
  private func generateThumbnail(from url: URL, cacheKey: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
	
	// Create AVAsset from URL
	let asset = AVAsset(url: url)
	let imageGenerator = AVAssetImageGenerator(asset: asset)
	
	// Configure image generator
	imageGenerator.appliesPreferredTrackTransform = true
	imageGenerator.requestedTimeToleranceBefore = CMTime.zero
	imageGenerator.requestedTimeToleranceAfter = CMTime.zero
	
	// Set thumbnail time to 0 seconds
	let time = CMTime(seconds: 0, preferredTimescale: 600)
	
	// Generate thumbnail asynchronously
	imageGenerator.generateCGImagesAsynchronously(forTimes: [NSValue(time: time)]) { [weak self] (requestedTime, cgImage, actualTime, result, error) in
	  
	  DispatchQueue.main.async {
		if let error = error {
		  rejecter("THUMBNAIL_GENERATION_FAILED", "Failed to generate thumbnail: \(error.localizedDescription)", error)
		  return
		}
		
		guard let cgImage = cgImage else {
		  rejecter("NO_IMAGE_GENERATED", "No thumbnail image was generated", nil)
		  return
		}
		
		// Convert CGImage to UIImage
		let uiImage = UIImage(cgImage: cgImage)
		
		// Cache the image
		self?.cacheImage(uiImage, forKey: cacheKey)
		
		// Create result and resolve
		let result = self?.createResultDictionary(from: uiImage) ?? [:]
		resolver(result)
	  }
	}
  }
  
  private func cacheImage(_ image: UIImage, forKey cacheKey: String) {
	// Calculate image size in bytes for memory cache cost
	let imageSizeInBytes = calculateImageSizeInBytes(image)
	
	// Store in memory cache with cost (NSCache will automatically evict oldest items when limit is reached)
	VideoThumbnailModule.memoryCache.setObject(image, forKey: cacheKey as NSString, cost: imageSizeInBytes)
	
	// Store in disk cache
	saveToDiskCache(image: image, cacheKey: cacheKey)
  }
  
  private func saveToDiskCache(image: UIImage, cacheKey: String) {
	guard let cacheDirectory = VideoThumbnailModule.cacheDirectory,
		  let imageData = image.jpegData(compressionQuality: 0.8) else {
	  return
	}
	
	let fileURL = cacheDirectory.appendingPathComponent("\(cacheKey).jpg")
	
	DispatchQueue.global(qos: .background).async {
	  try? imageData.write(to: fileURL)
	}
  }
  
  private func loadFromDiskCache(cacheKey: String) -> UIImage? {
	guard let cacheDirectory = VideoThumbnailModule.cacheDirectory else {
	  return nil
	}
	
	let fileURL = cacheDirectory.appendingPathComponent("\(cacheKey).jpg")
	
	guard VideoThumbnailModule.fileManager.fileExists(atPath: fileURL.path),
		  let imageData = try? Data(contentsOf: fileURL),
		  let image = UIImage(data: imageData) else {
	  return nil
	}
	
	return image
  }
  
  private func createResultDictionary(from image: UIImage) -> [String: Any] {
	guard let imageData = image.jpegData(compressionQuality: 0.8) else {
	  return [:]
	}
	
	let base64String = imageData.base64EncodedString()
	let dataURI = "data:image/jpeg;base64,\(base64String)"
	
	return [
	  "uri": dataURI,
	  "width": Int(image.size.width),
	  "height": Int(image.size.height)
	]
  }
  
  private func calculateImageSizeInBytes(_ image: UIImage) -> Int {
	// Estimate the size of the image in memory
	let width = Int(image.size.width * image.scale)
	let height = Int(image.size.height * image.scale)
	let bytesPerPixel = 4 // RGBA
	return width * height * bytesPerPixel
  }
}

// MARK: - Data Extension for SHA256
extension Data {
  var sha256: String {
	if #available(iOS 13.0, *) {
	  let hashed = SHA256.hash(data: self)
	  return hashed.compactMap { String(format: "%02x", $0) }.joined()
	} else {
	  // Fallback for iOS < 13.0 using simple hash
	  return "\(self.hashValue)"
	}
  }
}
