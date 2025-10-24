import Foundation
import SDWebImage
import React

@objc(FastNativeImageViewManager)
class FastNativeImageViewManager: RCTViewManager {
  
  override func view() -> UIView! {
	return FastNativeImageView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
	return true
  }
  
  // Clear memory cache
  @objc func clearMemoryCache(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
	SDImageCache.shared.clearMemory()
	resolve(true)
  }
  
  // Clear disk cache
  @objc func clearDiskCache(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
	SDImageCache.shared.clearDisk {
	  resolve(true)
	}
  }
  
  // Clear all cache
  @objc func clearCache(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
	SDImageCache.shared.clearMemory()
	SDImageCache.shared.clearDisk {
	  resolve(true)
	}
  }
  
  // Get cache size
  @objc func getCacheSize(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
	SDImageCache.shared.calculateSize { (fileCount, totalSize) in
	  resolve([
		"fileCount": fileCount,
		"totalSize": totalSize
	  ])
	}
  }
  
  // Prefetch images
  @objc func prefetchURLs(_ urls: [String], resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
	let imageURLs = urls.compactMap { URL(string: $0) }
	let prefetcher = SDWebImagePrefetcher.shared
	
	prefetcher.prefetchURLs(imageURLs) { _, _ in
	  resolve(true)
	}
  }
}
