import UIKit
import SDWebImage
import React

@objc(FastNativeImageView)
class FastNativeImageView: UIView {
  
  private var imageView: UIImageView!
  private var activityIndicator: UIActivityIndicatorView!
  private var currentURL: URL?
  
  private let maxCacheSize: UInt = 500 * 1024 * 1024
  private let targetCacheSize: UInt = 200 * 1024 * 1024
  private let cacheCheckInterval: TimeInterval = 60
  private static var lastCacheCheck: Date = Date()
  
  override init(frame: CGRect) {
	super.init(frame: frame)
	setupViews()
	configureSDWebImage()
  }
  
  required init?(coder: NSCoder) {
	super.init(coder: coder)
	setupViews()
	configureSDWebImage()
  }
  
  private func setupViews() {
	imageView = UIImageView(frame: bounds)
	imageView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
	imageView.contentMode = .scaleAspectFill
	imageView.clipsToBounds = true
	imageView.layer.drawsAsynchronously = true
	addSubview(imageView)
	
	if #available(iOS 13.0, *) {
	  activityIndicator = UIActivityIndicatorView(style: .medium)
	} else {
	  activityIndicator = UIActivityIndicatorView(style: .gray)
	}
	activityIndicator.center = CGPoint(x: bounds.midX, y: bounds.midY)
	activityIndicator.autoresizingMask = [.flexibleLeftMargin, .flexibleRightMargin, .flexibleTopMargin, .flexibleBottomMargin]
	activityIndicator.hidesWhenStopped = true
	addSubview(activityIndicator)
  }
  
  private func configureSDWebImage() {
	let cache = SDImageCache.shared
	
	// Memory cache configuration
	cache.config.maxMemoryCost = 100 * 1024 * 1024 // 100 MB
	cache.config.maxMemoryCount = 50
	cache.config.shouldUseWeakMemoryCache = true
	
	// Disk cache configuration
	cache.config.maxDiskAge = 60 * 60 * 24 * 7 // 7 days
	cache.config.maxDiskSize = maxCacheSize // 500 MB max
	cache.config.diskCacheExpireType = .accessDate // Remove least recently accessed first
	
	// Downloader configuration
	let downloader = SDWebImageDownloader.shared
	downloader.config.maxConcurrentDownloads = 6
	downloader.config.downloadTimeout = 15.0
	downloader.config.executionOrder = .lifoExecutionOrder
  }
  
  @objc var source: NSDictionary? {
	didSet {
	  if source != oldValue {
		loadImage()
	  }
	}
  }
  
  @objc var resizeMode: String = "cover" {
	didSet {
	  updateContentMode()
	}
  }
  
  @objc var onLoadStart: RCTDirectEventBlock?
  @objc var onLoad: RCTDirectEventBlock?
  @objc var onError: RCTDirectEventBlock?
  
  private func updateContentMode() {
	switch resizeMode {
	case "cover":
	  imageView.contentMode = .scaleAspectFill
	case "contain":
	  imageView.contentMode = .scaleAspectFit
	case "stretch":
	  imageView.contentMode = .scaleToFill
	case "center":
	  imageView.contentMode = .center
	default:
	  imageView.contentMode = .scaleAspectFill
	}
  }
  
  private func checkAndCleanCache() {
	let now = Date()
	
	guard now.timeIntervalSince(FastNativeImageView.lastCacheCheck) > cacheCheckInterval else {
	  return
	}
	
	FastNativeImageView.lastCacheCheck = now
	
	DispatchQueue.global(qos: .utility).async { [weak self] in
	  guard let self = self else { return }
	  
	  SDImageCache.shared.calculateSize { (fileCount, totalSize) in
		if totalSize >= self.maxCacheSize {
		  self.cleanCache(currentSize: totalSize)
		}
	  }
	}
  }
  
  private func cleanCache(currentSize: UInt) {
	let sizeToRemove = currentSize - targetCacheSize
	
	print("🧹 Cache cleanup started: \(currentSize / 1024 / 1024)MB -> target \(targetCacheSize / 1024 / 1024)MB")
	
	DispatchQueue.global(qos: .utility).async {
	  let cache = SDImageCache.shared
	  
	  guard let cachePath = cache.diskCachePath as String?,
			let fileManager = FileManager.default as FileManager?,
			let files = try? fileManager.contentsOfDirectory(atPath: cachePath) else {
		return
	  }
	  
	  var filesToRemove: [(path: String, date: Date, size: UInt64)] = []
	  var removedSize: UInt64 = 0
	  
	  // Collect file info
	  for file in files {
		let filePath = (cachePath as NSString).appendingPathComponent(file)
		
		guard let attributes = try? fileManager.attributesOfItem(atPath: filePath),
			  let modificationDate = attributes[.modificationDate] as? Date,
			  let fileSize = attributes[.size] as? UInt64 else {
		  continue
		}
		
		filesToRemove.append((path: filePath, date: modificationDate, size: fileSize))
	  }
	  
	  filesToRemove.sort { $0.date < $1.date }
	  
	  for fileInfo in filesToRemove {
		guard removedSize < sizeToRemove else { break }
		
		try? fileManager.removeItem(atPath: fileInfo.path)
		removedSize += fileInfo.size
	  }
	  
	  DispatchQueue.main.async {
		SDImageCache.shared.clearMemory()
	  }
	}
  }
  
  private func loadImage() {
	guard let source = source,
		  let uri = source["uri"] as? String,
		  !uri.isEmpty,
		  let url = URL(string: uri) else {
	  onError?(["error": "Invalid URL"])
	  return
	}
	
	if currentURL == url && imageView.image != nil {
	  return
	}
	
	checkAndCleanCache()
	
	imageView.sd_cancelCurrentImageLoad()
	currentURL = url
	
	onLoadStart?([:])
	activityIndicator.startAnimating()
	
	var options: SDWebImageOptions = [
	  .retryFailed,
	  .scaleDownLargeImages,
	  .continueInBackground,
	  .handleCookies,
	  .progressiveLoad,
	  .avoidAutoSetImage
	]
	
	if let priority = source["priority"] as? String {
	  switch priority {
	  case "high":
		options.insert(.highPriority)
	  case "low":
		options.insert(.lowPriority)
	  default:
		break
	  }
	}
	
	var context: [SDWebImageContextOption: Any] = [:]
	
	let size = bounds.size
	if size.width > 0 && size.height > 0 {
	  let scale = UIScreen.main.scale
	  let pixelSize = CGSize(width: ceil(size.width * scale), height: ceil(size.height * scale))
	  context[.imageThumbnailPixelSize] = NSValue(cgSize: pixelSize)
	}
	
	context[.imageScaleFactor] = UIScreen.main.scale
	
	if let headers = source["headers"] as? [String: String] {
	  var modifiedRequest = URLRequest(url: url)
	  for (key, value) in headers {
		modifiedRequest.setValue(value, forHTTPHeaderField: key)
	  }
	  context[.downloadRequestModifier] = SDWebImageDownloaderRequestModifier(block: { _ in
		return modifiedRequest
	  })
	}
	
	imageView.sd_setImage(
	  with: url,
	  placeholderImage: nil,
	  options: options,
	  context: context,
	  progress: nil
	) { [weak self] (image, error, cacheType, imageURL) in
	  guard let self = self else { return }
	  
	  self.activityIndicator.stopAnimating()
	  
	  if let error = error {
		self.currentURL = nil
		self.onError?([
		  "error": error.localizedDescription
		])
	  } else if let image = image {
		let shouldAnimate = cacheType == .none
		
		if shouldAnimate {
		  UIView.transition(with: self.imageView,
						   duration: 0.2,
						   options: .transitionCrossDissolve,
						   animations: {
			self.imageView.image = image
		  }, completion: nil)
		} else {
		  self.imageView.image = image
		}
		
		self.onLoad?([
		  "width": image.size.width,
		  "height": image.size.height
		])
	  }
	}
  }
  
  override func layoutSubviews() {
	super.layoutSubviews()
	imageView.frame = bounds
	activityIndicator.center = CGPoint(x: bounds.midX, y: bounds.midY)
  }
  
  override func didMoveToWindow() {
	super.didMoveToWindow()
	
	if window == nil {
	  if let image = imageView.image {
		let imageSize = image.size.width * image.size.height * image.scale * image.scale
		let threshold: CGFloat = 2048 * 2048
		
		if imageSize > threshold {
		  imageView.image = nil
		}
	  }
	}
  }
  
  deinit {
	imageView.sd_cancelCurrentImageLoad()
	currentURL = nil
  }
}
