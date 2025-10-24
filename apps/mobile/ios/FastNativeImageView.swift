import UIKit
import SDWebImage
import React

@objc(FastNativeImageView)
class FastNativeImageView: UIView {
  
  private var imageView: UIImageView!
  private var activityIndicator: UIActivityIndicatorView!
  
  override init(frame: CGRect) {
	super.init(frame: frame)
	setupViews()
  }
  
  required init?(coder: NSCoder) {
	super.init(coder: coder)
	setupViews()
  }
  
  private func setupViews() {
	// Setup image view
	imageView = UIImageView(frame: bounds)
	imageView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
	imageView.contentMode = .scaleAspectFill
	imageView.clipsToBounds = true
	addSubview(imageView)
	
	// Setup loading indicator
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
  
  @objc var source: NSDictionary? {
	didSet {
	  loadImage()
	}
  }
  
  @objc var resizeMode: String = "cover" {
	didSet {
	  updateContentMode()
	}
  }
  
  @objc var placeholder: String?
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
  
  private func loadImage() {
	guard let source = source,
		  let uri = source["uri"] as? String,
		  !uri.isEmpty,
		  let url = URL(string: uri) else {
	  onError?(["error": "Invalid URL"])
	  return
	}
	// Fire onLoadStart event
	onLoadStart?([:])
	activityIndicator.startAnimating()
	
	// Configure SDWebImage options
	var options: SDWebImageOptions = [
	  .retryFailed,
	  .scaleDownLargeImages,
	  .continueInBackground,
	  .handleCookies
	]
	
	// Set priority
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
	
	// Create context for downsampling
	var context: [SDWebImageContextOption: Any] = [:]
	
	// Add downsampling for better memory performance
	let size = bounds.size
	if size.width > 0 && size.height > 0 {
	  let scale = UIScreen.main.scale
	  let pixelSize = CGSize(width: size.width * scale, height: size.height * scale)
	  context[.imageThumbnailPixelSize] = NSValue(cgSize: pixelSize)
	}
	
	// Load the image
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
		self.onError?([
		  "error": error.localizedDescription
		])
	  } else if let image = image {
		self.onLoad?([
		  "width": image.size.width,
		  "height": image.size.height,
		  "cacheType": self.getCacheTypeString(cacheType)
		])
	  }
	}
  }
  
  private func getCacheTypeString(_ cacheType: SDImageCacheType) -> String {
	switch cacheType {
	case .none:
	  return "none"
	case .disk:
	  return "disk"
	case .memory:
	  return "memory"
	case .all:
	  return "all"
	@unknown default:
	  return "unknown"
	}
  }
  
  override func layoutSubviews() {
	super.layoutSubviews()
	imageView.frame = bounds
	activityIndicator.center = CGPoint(x: bounds.midX, y: bounds.midY)
  }
  
  // Memory management
  deinit {
	imageView.sd_cancelCurrentImageLoad()
  }
}
