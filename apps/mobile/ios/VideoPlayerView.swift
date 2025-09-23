import UIKit
import AVKit
import AVFoundation
import React
import CommonCrypto

class VideoPlayerView: UIView {
	private var playerViewController: AVPlayerViewController?
	private var player: AVPlayer?
	private var playerItem: AVPlayerItem?
	private static let cacheDirectory = "VideoCache"
	private static let maxCacheSize: Int64 = 100 * 1024 * 1024 // 100MB in bytes
	
	@objc var source: String = "" {
		didSet {
			setupPlayer()
		}
	}
	
	override init(frame: CGRect) {
		super.init(frame: frame)
		setupCache()
		setupPlayerViewController()
	}
	
	required init?(coder: NSCoder) {
		super.init(coder: coder)
		setupCache()
		setupPlayerViewController()
	}
	
	private func setupCache() {
		let cacheURL = getCacheDirectory()
		if !FileManager.default.fileExists(atPath: cacheURL.path) {
			try? FileManager.default.createDirectory(at: cacheURL, withIntermediateDirectories: true, attributes: nil)
		}
	}
	
	private func getCacheDirectory() -> URL {
		let documentsPath = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
		return documentsPath.appendingPathComponent(VideoPlayerView.cacheDirectory)
	}
	
	private func getCacheKey(for url: String) -> String {
		return url.md5
	}
	
	private func getCachedVideoURL(for originalURL: String) -> URL? {
		let cacheKey = getCacheKey(for: originalURL)
		let cacheURL = getCacheDirectory().appendingPathComponent("\(cacheKey).mov")
		
		if FileManager.default.fileExists(atPath: cacheURL.path) {
			print("VideoPlayerView: Found cached video at \(cacheURL)")
			// Update access time for LRU cache management
			updateFileAccessTime(url: cacheURL)
			return cacheURL
		}
		return nil
	}
	
	private func updateFileAccessTime(url: URL) {
		let now = Date()
		do {
			try FileManager.default.setAttributes([.modificationDate: now], ofItemAtPath: url.path)
		} catch {
			print("VideoPlayerView: Failed to update access time - \(error)")
		}
	}
	
	private func manageCacheSize() {
		let cacheSize = getCacheSize()
		
		if cacheSize >= VideoPlayerView.maxCacheSize {
			print("VideoPlayerView: Cache size (\(cacheSize) bytes) exceeds limit (\(VideoPlayerView.maxCacheSize) bytes). Cleaning up...")
			removeOldestCacheFiles(targetSize: VideoPlayerView.maxCacheSize / 2) // Clean to 50MB to avoid frequent cleanup
		}
	}
	
	private func removeOldestCacheFiles(targetSize: Int64) {
		let cacheURL = getCacheDirectory()
		
		do {
			let fileURLs = try FileManager.default.contentsOfDirectory(at: cacheURL, includingPropertiesForKeys: [.contentModificationDateKey, .fileSizeKey], options: [])
			
			// Get files with their modification dates and sizes
			var filesWithDates: [(url: URL, date: Date, size: Int64)] = []
			
			for fileURL in fileURLs {
				let resourceValues = try fileURL.resourceValues(forKeys: [.contentModificationDateKey, .fileSizeKey])
				if let modificationDate = resourceValues.contentModificationDate,
				   let fileSize = resourceValues.fileSize {
					filesWithDates.append((url: fileURL, date: modificationDate, size: Int64(fileSize)))
				}
			}
			
			// Sort by modification date (oldest first)
			filesWithDates.sort { $0.date < $1.date }
			
			var currentSize = getCacheSize()
			var deletedCount = 0
			
			// Remove files until we reach target size
			for fileInfo in filesWithDates {
				if currentSize <= targetSize {
					break
				}
				
				do {
					try FileManager.default.removeItem(at: fileInfo.url)
					currentSize -= fileInfo.size
					deletedCount += 1
					print("VideoPlayerView: Removed cached file: \(fileInfo.url.lastPathComponent)")
				} catch {
					print("VideoPlayerView: Failed to remove cached file \(fileInfo.url.lastPathComponent) - \(error)")
				}
			}
			
			print("VideoPlayerView: Cache cleanup completed. Removed \(deletedCount) files. New cache size: \(currentSize) bytes")
			
		} catch {
			print("VideoPlayerView: Failed to enumerate cache directory - \(error)")
		}
	}
	
	private func getCacheSize() -> Int64 {
		let cacheURL = getCacheDirectory()
		var size: Int64 = 0
		
		do {
			let fileURLs = try FileManager.default.contentsOfDirectory(at: cacheURL, includingPropertiesForKeys: [.fileSizeKey], options: [])
			
			for fileURL in fileURLs {
				let resourceValues = try fileURL.resourceValues(forKeys: [.fileSizeKey])
				size += Int64(resourceValues.fileSize ?? 0)
			}
		} catch {
			print("VideoPlayerView: Error calculating cache size - \(error)")
		}
		
		return size
	}
	
	private func setupPlayerViewController() {
		playerViewController = AVPlayerViewController()
		playerViewController?.showsPlaybackControls = true
		playerViewController?.allowsPictureInPicturePlayback = true
		
		// Remove the activity indicator
		if let playerVC = playerViewController {
			// Hide the loading spinner
			playerVC.setValue(false, forKey: "showsPlaybackControls")
			playerVC.setValue(true, forKey: "showsPlaybackControls")
			
			addSubview(playerVC.view)
			playerVC.view.frame = bounds
			playerVC.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
			playerVC.view.backgroundColor = UIColor.black
		}
	}
	
	private func setupPlayer() {
		guard !source.isEmpty else {
			print("VideoPlayerView: Empty source")
			return
		}
		
		guard let url = URL(string: source) else {
			print("VideoPlayerView: Invalid URL - \(source)")
			return
		}
		
		print("VideoPlayerView: Setting up player with URL - \(url)")
		
		// Clean up previous player
		cleanupPlayer()
		
		// Check and manage cache size before loading
		manageCacheSize()
		
		// Check cache first
		if let cachedURL = getCachedVideoURL(for: source) {
			print("VideoPlayerView: Using cached video")
			playVideo(url: cachedURL)
			return
		}
		
		// For remote URLs, download and cache
		if url.scheme == "https" || url.scheme == "http" {
			downloadCacheAndPlay(url: url)
		} else {
			// For local files, play directly
			playVideo(url: url)
		}
	}
	
	private func downloadCacheAndPlay(url: URL) {
		print("VideoPlayerView: Downloading and caching video from URL")
		
		// Create URLSession configuration for better performance
		let configuration = URLSessionConfiguration.default
		configuration.requestCachePolicy = .returnCacheDataElseLoad
		configuration.urlCache = URLCache.shared
		configuration.timeoutIntervalForRequest = 30
		configuration.timeoutIntervalForResource = 300
		
		let session = URLSession(configuration: configuration)
		
		let task = session.downloadTask(with: url) { [weak self] (tempURL, response, error) in
			DispatchQueue.main.async {
				if let error = error {
					print("VideoPlayerView: Download error - \(error.localizedDescription)")
					// Fallback to direct streaming if download fails
					self?.playVideo(url: url)
					return
				}
				
				guard let tempURL = tempURL else {
					print("VideoPlayerView: No temp URL received")
					self?.playVideo(url: url)
					return
				}
				
				// Cache the file
				let cacheKey = self?.getCacheKey(for: url.absoluteString) ?? UUID().uuidString
				let cacheURL = self?.getCacheDirectory().appendingPathComponent("\(cacheKey).mov")
				
				guard let finalCacheURL = cacheURL else { return }
				
				do {
					// Remove existing cached file if it exists
					if FileManager.default.fileExists(atPath: finalCacheURL.path) {
						try FileManager.default.removeItem(at: finalCacheURL)
					}
					
					// Move downloaded file to cache directory
					try FileManager.default.moveItem(at: tempURL, to: finalCacheURL)
					print("VideoPlayerView: Video cached successfully to \(finalCacheURL)")
					
					// Update modification date for LRU tracking
					self?.updateFileAccessTime(url: finalCacheURL)
					
					// Check cache size after adding new file and clean if needed
					self?.manageCacheSize()
					
					// Play the cached video
					self?.playVideo(url: finalCacheURL)
					
				} catch {
					print("VideoPlayerView: Cache error - \(error.localizedDescription)")
					// Fallback to direct streaming
					self?.playVideo(url: url)
				}
			}
		}
		
		task.resume()
	}
	
	private func playVideo(url: URL) {
		print("VideoPlayerView: Playing video from \(url)")
		
		// Create asset with optimized options
		let asset = AVURLAsset(url: url, options: [
			AVURLAssetPreferPreciseDurationAndTimingKey: false // Faster loading
		])
		
		// Preload asset keys asynchronously for better performance
		let requiredKeys = ["playable", "duration"]
		asset.loadValuesAsynchronously(forKeys: requiredKeys) { [weak self] in
			DispatchQueue.main.async {
				var error: NSError?
				let status = asset.statusOfValue(forKey: "playable", error: &error)
				
				switch status {
				case .loaded:
					self?.createPlayerItem(with: asset)
				case .failed:
					print("VideoPlayerView: Asset loading failed - \(error?.localizedDescription ?? "Unknown error")")
				case .cancelled:
					print("VideoPlayerView: Asset loading cancelled")
				default:
					print("VideoPlayerView: Asset loading status: \(status)")
				}
			}
		}
	}
	
	private func createPlayerItem(with asset: AVAsset) {
		playerItem = AVPlayerItem(asset: asset)
		
		// Optimize buffer settings
		if let playerItem = playerItem {
			playerItem.preferredForwardBufferDuration = 5.0 // 5 seconds buffer
			
			// Add observers
			playerItem.addObserver(self, forKeyPath: "status", options: [.new, .initial], context: nil)
			playerItem.addObserver(self, forKeyPath: "playbackLikelyToKeepUp", options: [.new], context: nil)
		}
		
		player = AVPlayer(playerItem: playerItem)
		
		// Optimize player settings
		player?.automaticallyWaitsToMinimizeStalling = false
		player?.actionAtItemEnd = .none
		
		// Set player to view controller
		playerViewController?.player = player
		
		print("VideoPlayerView: Player created and ready")
	}
	
	private func cleanupPlayer() {
		player?.pause()
		
		if let previousItem = playerItem {
			previousItem.removeObserver(self, forKeyPath: "status")
			previousItem.removeObserver(self, forKeyPath: "playbackLikelyToKeepUp")
		}
		
		playerItem = nil
		player = nil
	}
	
	override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
		guard let keyPath = keyPath else { return }
		
		switch keyPath {
		case "status":
			if let playerItem = playerItem {
				switch playerItem.status {
				case .readyToPlay:
					print("VideoPlayerView: Player ready to play")
					// Auto play immediately when ready
					player?.play()
				case .failed:
					if let error = playerItem.error {
						print("VideoPlayerView: Player failed with error - \(error.localizedDescription)")
					}
				case .unknown:
					print("VideoPlayerView: Player status unknown")
				@unknown default:
					print("VideoPlayerView: Player status unknown default")
				}
			}
		case "playbackLikelyToKeepUp":
			if let playerItem = playerItem, playerItem.isPlaybackLikelyToKeepUp {
				print("VideoPlayerView: Playback likely to keep up - starting playback")
				player?.play()
			}
		default:
			break
		}
	}
	
	deinit {
		cleanupPlayer()
	}
	
	override func layoutSubviews() {
		super.layoutSubviews()
		playerViewController?.view.frame = bounds
	}
	
	// MARK: - Cache Management
	
	static func clearCache() {
		let cacheURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
			.appendingPathComponent(cacheDirectory)
		
		do {
			try FileManager.default.removeItem(at: cacheURL)
			print("VideoPlayerView: Cache cleared successfully")
		} catch {
			print("VideoPlayerView: Failed to clear cache - \(error.localizedDescription)")
		}
	}
	
	static func getCacheSizeFormatted() -> String {
		let size = getCacheSize()
		let formatter = ByteCountFormatter()
		formatter.allowedUnits = [.useMB, .useKB, .useBytes]
		formatter.countStyle = .file
		return formatter.string(fromByteCount: size)
	}
	
	private static func getCacheSize() -> Int64 {
		let cacheURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
			.appendingPathComponent(cacheDirectory)
		
		var size: Int64 = 0
		
		do {
			let fileURLs = try FileManager.default.contentsOfDirectory(at: cacheURL, includingPropertiesForKeys: [.fileSizeKey], options: [])
			
			for fileURL in fileURLs {
				let resourceValues = try fileURL.resourceValues(forKeys: [.fileSizeKey])
				size += Int64(resourceValues.fileSize ?? 0)
			}
		} catch {
			print("VideoPlayerView: Error calculating cache size - \(error)")
		}
		
		return size
	}
}

// MARK: - String Extension for MD5
extension String {
	var md5: String {
		let data = Data(self.utf8)
		let hash = data.withUnsafeBytes { (bytes: UnsafeRawBufferPointer) -> [UInt8] in
			var hash = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
			CC_MD5(bytes.baseAddress, CC_LONG(data.count), &hash)
			return hash
		}
		return hash.map { String(format: "%02x", $0) }.joined()
	}
}
