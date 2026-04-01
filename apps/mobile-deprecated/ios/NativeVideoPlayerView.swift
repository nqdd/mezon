import UIKit
import AVKit
import AVFoundation
import React

@objc(NativeVideoPlayerView)
class NativeVideoPlayerView: UIView {
	
	private var playerViewController: AVPlayerViewController?
	private var player: AVPlayer?
	
	// Properties that can be set from React Native
	@objc var source: String = "" {
		didSet {
			setupPlayer()
		}
	}
	
	@objc var autoplay: Bool = false {
		didSet {
			if autoplay && player != nil {
				player?.play()
			}
		}
	}
	
	@objc var showsPlaybackControls: Bool = true {
		didSet {
			playerViewController?.showsPlaybackControls = showsPlaybackControls
		}
	}
	
	@objc var onLoad: RCTDirectEventBlock?
	@objc var onError: RCTDirectEventBlock?
	@objc var onEnd: RCTDirectEventBlock?
	
	override init(frame: CGRect) {
		super.init(frame: frame)
		setupPlayerViewController()
	}
	
	required init?(coder: NSCoder) {
		super.init(coder: coder)
		setupPlayerViewController()
	}
	
	private func setupPlayerViewController() {
		playerViewController = AVPlayerViewController()
		playerViewController?.showsPlaybackControls = showsPlaybackControls
		
		guard let playerViewController = playerViewController else { return }
		
		addSubview(playerViewController.view)
		playerViewController.view.translatesAutoresizingMaskIntoConstraints = false
		
		NSLayoutConstraint.activate([
			playerViewController.view.topAnchor.constraint(equalTo: topAnchor),
			playerViewController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
			playerViewController.view.trailingAnchor.constraint(equalTo: trailingAnchor),
			playerViewController.view.bottomAnchor.constraint(equalTo: bottomAnchor)
		])
	}
	
	private func setupPlayer() {
		guard !source.isEmpty else { return }
		
		let url: URL?
		
		// Check if it's a local file or remote URL
		if source.hasPrefix("http") || source.hasPrefix("https") {
			url = URL(string: source)
		} else {
			// Handle local files (including bundle resources)
			if source.hasPrefix("file://") {
				url = URL(string: source)
			} else {
				// Try to find in bundle first
				if let bundlePath = Bundle.main.path(forResource: source, ofType: nil) {
					url = URL(fileURLWithPath: bundlePath)
				} else {
					// Try documents directory
					let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
					let filePath = (documentsPath as NSString).appendingPathComponent(source)
					url = URL(fileURLWithPath: filePath)
				}
			}
		}
		
		guard let videoURL = url else {
			onError?(["error": "Invalid video URL"])
			return
		}
		
		// Create player item
		let playerItem = AVPlayerItem(url: videoURL)
		
		// Add observers for player events
		NotificationCenter.default.addObserver(
			self,
			selector: #selector(playerDidFinishPlaying),
			name: .AVPlayerItemDidPlayToEndTime,
			object: playerItem
		)
		
		// Observer for when item is ready to play
		playerItem.addObserver(self, forKeyPath: "status", options: .new, context: nil)
		
		// Create and set up player
		player = AVPlayer(playerItem: playerItem)
		playerViewController?.player = player
		
		// Auto play if enabled
		if autoplay {
			player?.play()
		}
	}
	
	override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
		if keyPath == "status" {
			if let playerItem = object as? AVPlayerItem {
				switch playerItem.status {
				case .readyToPlay:
					let duration = CMTimeGetSeconds(playerItem.duration)
					onLoad?(["duration": duration])
				case .failed:
					onError?(["error": playerItem.error?.localizedDescription ?? "Unknown error"])
				default:
					break
				}
			}
		}
	}
	
	@objc private func playerDidFinishPlaying() {
		onEnd?([:])
	}
	
	// Removed programmatic control methods since we're using native controls only
	
	deinit {
		NotificationCenter.default.removeObserver(self)
		player?.currentItem?.removeObserver(self, forKeyPath: "status")
	}
}
