'use client';

import mezonPackage from '@mezon/package-js';
import { Icons } from '@mezon/ui';
import { getPlatform, Platform } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../homepage/mezonpage/footer';
import HeaderMezon from '../homepage/mezonpage/header';

const TextChannelPage = () => {
	const platform = getPlatform();
	const version = mezonPackage.version;
	const downloadUrl: string =
		platform === Platform.MACOS
			? `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-arm64.dmg`
			: platform === Platform.LINUX
				? `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-linux-amd64.deb`
				: `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64.exe`;
	const universalUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-x64.dmg`;
	const portableUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64-portable.exe`;

	const [currentSlide, setCurrentSlide] = useState(0);
	const [activeFeature, setActiveFeature] = useState(0);

	const features = [
		{
			id: 0,
			title: 'Share photos and videos',
			description: 'Easily share photos, videos, and media files with your team in high quality.',
			image: '/assets/text-channel.webp'
		},
		{
			id: 1,
			title: 'Send video notes',
			description: 'Capture the feel of the moment by instantly recording and sharing video messages up to a minute long in the chat.',
			image: '/assets/voice-channel.webp'
		},
		{
			id: 2,
			title: 'Say even more with stickers and GIFs',
			description: 'Express yourself with a wide variety of stickers, GIFs, and animated emojis.',
			image: '/assets/text-channel.webp'
		},
		{
			id: 3,
			title: 'React with an emoji',
			description: 'Quickly respond to messages with emoji reactions without typing a word.',
			image: '/assets/voice-channel.webp'
		}
	];

	const slides = [
		{
			title: 'Share Your Moments',
			description: 'Connect with your team and share your best moments in real-time'
		},
		{
			title: 'Collaborate Seamlessly',
			description: 'Work together on projects and stay synchronized across all devices'
		},
		{
			title: 'Stay Connected',
			description: 'Never miss an update with instant notifications and real-time chat'
		},
		{
			title: 'Team Building',
			description: 'Build stronger relationships through meaningful conversations'
		}
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<HeaderMezon
				sideBarIsOpen={false}
				toggleSideBar={() => {
					('');
				}}
				scrollToSection={() => {
					('');
				}}
			/>
			<section className="pt-[120px] pb-20 max-md:pt-[100px] max-md:pb-12 px-4 bg-[#F8F9FA]">
				<div className="container max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="max-lg:text-center">
							<h1 className="text-7xl max-lg:text-5xl max-md:text-4xl font-bold mb-8 leading-tight">
								Connect through <span className="text-purple-600 block mt-2">Text Channels</span>
							</h1>
							<p className="text-xl max-md:text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
								Connect with your team through powerful text channels. Share messages, files, and collaborate in real-time with
								features designed to keep everyone in sync.
							</p>
							<a
								href={downloadUrl}
								className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
							>
								Download
								<Icons.Download className="w-5 h-5" />
							</a>
						</div>

						<div className="flex justify-center lg:justify-end">
							<img
								src="/assets/text-channel.webp"
								alt="Text Channel"
								className="w-full max-w-[500px] h-auto object-contain drop-shadow-2xl"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 max-md:py-12 px-4 bg-white">
				<div className="container max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div className="order-2 lg:order-1 flex justify-center">
							<div className="relative w-full max-w-[541px]">
								<img
									src={features[activeFeature].image}
									alt={features[activeFeature].title}
									className="w-full h-auto object-contain drop-shadow-2xl rounded-3xl transition-all duration-500"
									key={activeFeature}
								/>
							</div>
						</div>

						<div className="order-1 lg:order-2 space-y-1">
							{features.map((feature, index) => (
								<div key={feature.id} className="border-b border-gray-200 last:border-b-0">
									<button
										onClick={() => setActiveFeature(index)}
										className={`w-full text-left py-6 px-4 transition-all duration-300 hover:bg-purple-50 rounded-lg ${
											activeFeature === index ? 'bg-purple-50' : ''
										}`}
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<h3
													className={`text-2xl max-md:text-xl font-semibold mb-2 transition-colors ${
														activeFeature === index ? 'text-purple-600' : 'text-gray-900'
													}`}
												>
													{feature.title}
												</h3>
												<div
													className={`overflow-hidden transition-all duration-500 ${
														activeFeature === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
													}`}
												>
													<p className="text-gray-600 text-base leading-relaxed pr-8">{feature.description}</p>
												</div>
											</div>
										</div>
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 max-md:py-12 px-4 bg-[#F8F9FA]">
				<div className="container max-w-7xl mx-auto">
					<div className="max-w-4xl mx-auto">
						<h2 className="text-4xl max-md:text-3xl font-bold text-center mb-12">Everything you need for team communication</h2>
						<div className="space-y-8">
							<div className="flex gap-6 max-md:flex-col">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-3">Rich Text Formatting</h3>
									<p className="text-gray-600 leading-relaxed">
										Format your messages with bold, italic, code blocks, and more to make your communication clear and effective.
									</p>
								</div>
							</div>
							<div className="flex gap-6 max-md:flex-col">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-3">Message Search</h3>
									<p className="text-gray-600 leading-relaxed">
										Quickly find any message, file, or link with powerful search functionality that works across all your
										channels.
									</p>
								</div>
							</div>
							<div className="flex gap-6 max-md:flex-col">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-3">Message History</h3>
									<p className="text-gray-600 leading-relaxed">
										Never lose track of important conversations. All your messages are stored and accessible whenever you need
										them.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 max-md:py-12 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
				<div className="container max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="max-lg:text-center">
							<h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-6">
								Experience the <span className="text-purple-600">Power of Connection</span>
							</h2>
							<p className="text-lg text-gray-600 leading-relaxed mb-8">
								Discover amazing features and capabilities that make team communication effortless and enjoyable. Scroll through our
								gallery to see what's possible.
							</p>
							<div className="flex gap-3 max-lg:justify-center">
								<button
									onClick={prevSlide}
									className="p-3 rounded-full border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
									aria-label="Previous slide"
								>
									<Icons.ArrowLeft className="w-6 h-6 text-gray-600 hover:text-purple-600" />
								</button>
								<button
									onClick={nextSlide}
									className="p-3 rounded-full border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
									aria-label="Next slide"
								>
									<Icons.ArrowRight className="w-6 h-6 text-gray-600 hover:text-purple-600" />
								</button>
							</div>
							<div className="flex gap-2 justify-center lg:justify-start mt-6">
								{slides.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentSlide(index)}
										className={`h-2 rounded-full transition-all ${
											currentSlide === index ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
										}`}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>
						</div>

						<div className="relative w-full overflow-hidden rounded-3xl">
							<div
								className="flex transition-transform duration-500 ease-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{slides.map((slide, index) => (
									<div key={index} className="w-full flex-shrink-0">
										<div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
											<div className="bg-gradient-to-br from-green-400 to-green-500 aspect-video flex items-center justify-center overflow-hidden">
												<img src="/duck-race.png" alt={slide.title} className="w-full h-full object-cover" />
											</div>

											<div className="p-8 max-md:p-6">
												<h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-3">{slide.title}</h3>
												<p className="text-gray-600 text-base max-md:text-sm leading-relaxed">{slide.description}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-20 max-md:py-12 px-4">
				<div className="container max-w-7xl mx-auto text-center">
					<h2 className="text-4xl max-md:text-3xl font-bold mb-6">
						Ready to start <span className="text-purple-600">communicating</span>?
					</h2>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
						Join Mezon today and experience powerful text channels that bring your team together.
					</p>
					<Link
						to="/mezon"
						className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
					>
						Get Started
					</Link>
				</div>
			</section>

			<Footer downloadUrl={downloadUrl} universalUrl={universalUrl} portableUrl={portableUrl} />
		</div>
	);
};

export default TextChannelPage;
