import mezonPackage from '@mezon/package-js';
import { Icons } from '@mezon/ui';
import { Platform, getPlatform } from '@mezon/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../homepage/mezonpage/footer';
import HeaderMezon from '../homepage/mezonpage/header';

export const EconomyPage = () => {
	const platform = getPlatform();
	const version = mezonPackage.version;
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const heroRef = useRef<HTMLElement>(null);
	const transparentRef = useRef<HTMLElement>(null);
	const instantRef = useRef<HTMLElement>(null);
	const empowerRef = useRef<HTMLElement>(null);
	const commerceRef = useRef<HTMLElement>(null);
	const growRef = useRef<HTMLElement>(null);
	const ctaRef = useRef<HTMLElement>(null);

	const [heroVisible, setHeroVisible] = useState(false);
	const [transparentVisible, setTransparentVisible] = useState(false);
	const [instantVisible, setInstantVisible] = useState(false);
	const [empowerVisible, setEmpowerVisible] = useState(false);
	const [commerceVisible, setCommerceVisible] = useState(false);
	const [growVisible, setGrowVisible] = useState(false);
	const [ctaVisible, setCtaVisible] = useState(false);

	const [offset, setOffset] = useState(0);
	const cardWidth = 100 / 3;

	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [currentX, setCurrentX] = useState(0);
	const [dragOffset, setDragOffset] = useState(0);

	const cardsData = [
		{
			img: '/assets/free.png',
			title: 'Zero Platform Fee',
			desc: 'Send & receive without hidden costs. Every transaction goes directly to where it matters.'
		},
		{
			img: '/assets/bring.png',
			title: 'Secure & Hassle Free',
			desc: 'With zero-knowledge tech, no more account hassles. Your privacy is protected.'
		},
		{
			img: '/assets/fully.png',
			title: 'Fully Transparent',
			desc: 'All transactions transparent on Mezon Layer-1 Blockchain. Complete visibility.'
		},
		{
			img: '/assets/rewards.png',
			title: 'Rewards & Incentives',
			desc: 'Give instant bonuses or recognition with Mezon Dong'
		},
		{
			img: '/assets/internal.png',
			title: 'Internal Marketplace',
			desc: 'Use Mezon Dong for food, drinks, or internal services'
		},
		{
			img: '/assets/tip.png',
			title: 'Peer-to-Peer Appreciation',
			desc: 'Tip a colleague for a favor, cover coffee, or split lunch — without the awkwardness'
		},
		{
			img: '/assets/Integrate.png',
			title: 'Integrate Mezon Dong',
			desc: 'Enable seamless payments inside your platform or app'
		},
		{
			img: '/assets/creator.png',
			title: 'Co-create Experiences',
			desc: 'Build joint solutions that connect communities and brands'
		},
		{
			img: '/assets/scale.png',
			title: 'Scale with Ecosystem',
			desc: "Tap into Mezon's growing network of users and developers"
		}
	];

	const downloadUrl: string = useMemo(() => {
		if (platform === Platform.MACOS) {
			return `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-arm64.dmg`;
		} else if (platform === Platform.LINUX) {
			return `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-linux-amd64.deb`;
		}
		return `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64.exe`;
	}, [platform, version]);

	const universalUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-x64.dmg`;
	const portableUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64-portable.exe`;

	const handleDownloadMezon = () => {
		if (platform === Platform.IOS) {
			window.open('https://apps.apple.com/vn/app/mezon/id6502750046', '_blank');
		} else if (platform === Platform.ANDROID) {
			window.open('https://play.google.com/store/apps/details?id=com.mezon.mobile', '_blank');
		} else {
			setIsDropdownOpen(!isDropdownOpen);
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const observerOptions = { threshold: 0.2 };

		const observers = [
			{ ref: heroRef, setter: setHeroVisible },
			{ ref: transparentRef, setter: setTransparentVisible },
			{ ref: instantRef, setter: setInstantVisible },
			{ ref: empowerRef, setter: setEmpowerVisible },
			{ ref: commerceRef, setter: setCommerceVisible },
			{ ref: growRef, setter: setGrowVisible },
			{ ref: ctaRef, setter: setCtaVisible }
		];

		const observerInstances = observers.map(({ ref, setter }) => {
			const observer = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					setter(true);
				}
			}, observerOptions);

			if (ref.current) {
				observer.observe(ref.current);
			}

			return { observer, ref };
		});

		return () => {
			observerInstances.forEach(({ observer, ref }) => {
				if (ref.current) {
					observer.unobserve(ref.current);
				}
			});
		};
	}, []);

	const handlePrevSlide = () => {
		setOffset((prev) => {
			const newOffset = prev - cardWidth;
			if (newOffset < 0) {
				return cardWidth * (cardsData.length - 1);
			}
			return newOffset;
		});
	};

	const handleNextSlide = () => {
		setOffset((prev) => {
			const newOffset = prev + cardWidth;
			if (newOffset >= cardWidth * cardsData.length) {
				return 0;
			}
			return newOffset;
		});
	};

	const handleCardClick = (index: number) => {
		setOffset(index * cardWidth);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const extendedCards = [...cardsData, ...cardsData];

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">
			<style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .card-animate {
          animation: slideInUp 0.6s ease-out forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-animate:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(147, 51, 234, 0.15);
        }
      `}</style>

			<HeaderMezon
				sideBarIsOpen={false}
				toggleSideBar={() => {
					('');
				}}
				scrollToSection={() => {
					('');
				}}
			/>

			<section
				ref={heroRef}
				className={`pt-16 pb-10 md:pt-24 md:pb-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
			>
				<div className="container max-w-7xl mx-auto px-4">
					<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
						<div className="flex-1 w-full order-1 lg:order-1">
							<div className="max-w-[500px]">
								<h1 className="text-7xl md:text-7xl font-bold mb-6 text-black leading-tight">
									<span className="text-purple-600">Mezon Dong</span> - Powered By Trust
								</h1>
								<p className="text-xl text-gray-700 mb-8 leading-relaxed">
									Send <span className="text-purple-600 font-semibold">Mezon Dong</span> instantly, reward creators, and shop with
									partner brands — all with zero fee. Transparent and Secure
								</p>
								<div className="flex flex-col sm:flex-row gap-4">
									<a href="https://mezon.ai/docs/en/user/mezon-dong" target="_blank" rel="noopener noreferrer">
										<button className="px-8 py-3 border-2 border-purple-600 text-purple-600 text-base font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-md w-full sm:w-auto">
											Open Documentation
										</button>
									</a>
									<a href="https://cobar.vn/" target="_blank" rel="noopener noreferrer">
										<button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-base font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 shadow-md rounded-md w-full sm:w-auto">
											Explore Partners
										</button>
									</a>
								</div>
							</div>
						</div>

						<div className="flex-1 w-full order-2 lg:order-2">
							<div className="relative w-full max-w-[600px] mx-auto">
								<img
									src="/assets/economy_tranfer.png"
									alt="Mezon Dong Transfer"
									className="w-full h-auto object-contain rounded-3xl"
									style={{
										filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.3))'
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				ref={instantRef}
				className={`py-16 md:py-24 bg-white transition-all duration-700 ${instantVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
			>
				<div className="container max-w-7xl mx-auto px-4">
					<div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
						<div className="flex-1 w-full order-2">
							<div className="relative w-full max-w-[600px] mx-auto">
								<img
									src="/assets/economy-cobar-vendor.png"
									alt="Mezon Dong Cobar"
									className="w-full h-auto object-contain rounded-3xl"
									style={{
										filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.3))'
									}}
								/>
							</div>
						</div>

						<div className="flex-1 w-full order-1 lg:order-2">
							<div className="max-w-[500px] lg:ml-auto">
								<h2 className="text-6xl md:text-6xl font-bold mb-6 text-black">
									<span className="text-purple-600">Instant, Fair,</span> and Seamless
								</h2>
								<p className="text-xl text-gray-700 mb-8 leading-relaxed">
									Send <span className="text-purple-600 font-semibold">Mezon Dong</span> as easily as sending a message. Tip
									friends, contribute to your community, or buy stuff — all instantly and without fees.
								</p>
								<a href="https://cobar.vn/" target="_blank" rel="noopener noreferrer">
									<button className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 shadow-md rounded-md">
										Discover Cobar
									</button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				ref={commerceRef}
				className={`py-16 md:py-24 bg-white transition-all duration-700 ${commerceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
			>
				<div className="container max-w-7xl mx-auto px-4">
					<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
						<div className="flex-1 w-full order-2 lg:order-1">
							<div className="relative w-full max-w-[600px] mx-auto">
								<img
									src="/assets/economy-cobar-acheter.png"
									alt="Commerce Integrated"
									className="w-full h-auto object-contain rounded-3xl"
									style={{
										filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.3))'
									}}
								/>
							</div>
						</div>

						<div className="flex-1 w-full order-1 lg:order-2">
							<div className="max-w-[500px]">
								<h2 className="text-6xl md:text-6xl font-bold mb-6 text-black">
									<span className="text-purple-600">Commerce,</span> Integrated
								</h2>
								<p className="text-xl text-gray-700 mb-8 leading-relaxed">
									Partner brands can accept <span className="text-purple-600 font-semibold">Mezon Dong</span> for products and
									services. From digital goods to real-world items, communities can buy directly with a click.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<div className="mb-12">
						<h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
							Explore All <span className="text-purple-600">Features</span>
						</h2>
						<p className="text-lg md:text-xl text-gray-600 max-w-3xl">
							Discover everything <span className="text-purple-600 font-semibold">Mezon Dong</span> has to offer for your digital
							economy needs
						</p>
					</div>

					<div className="relative">
						<div className="flex gap-3 justify-end mb-6">
							<button
								onClick={handlePrevSlide}
								className="w-10 h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
								aria-label="Previous slide"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>

							<button
								onClick={handleNextSlide}
								className="w-10 h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
								aria-label="Next slide"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>

						<div>
							<div
								className="flex gap-8 transition-transform duration-500 ease-in-out"
								style={{
									transform: `translateX(-${offset}%)`
								}}
							>
								{cardsData.map((card, index) => (
									<div
										key={index}
										onClick={() => handleCardClick(index)}
										className="flex-shrink-0 w-full md:w-[calc(50%-16px)] group cursor-pointer"
									>
										<div className="relative bg-white shadow-md hover:shadow-2xl transition-all duration-300 h-full border border-gray-200 hover:border-transparent rounded-2xl">
											<div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-t-2xl"></div>

											<div className="p-12 md:p-16">
												<div className="mb-10 flex">
													<div className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center rounded-3xl bg-[#181126] group-hover:scale-110 transition-transform duration-300">
														<img
															src={card.img || '/placeholder.svg'}
															alt={card.title}
															className="w-16 h-16 md:w-20 md:h-20 object-contain"
														/>
													</div>
												</div>

												<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{card.title}</h3>

												<p className="text-lg md:text-xl text-gray-600 leading-relaxed">{card.desc}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				ref={ctaRef}
				className={`py-16 md:py-24 relative overflow-hidden bg-white transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
			>
				<div className="max-w-2xl mx-auto px-4 text-center relative z-10">
					<h2 className="text-6xl md:text-6xl font-bold mb-10 text-stone-800 leading-tight">
						Ready to experience a fair digital <span className="text-purple-600">economy</span>?
					</h2>
					<div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
						<a href="https://mezon.ai/docs/en/user/mezon-dong" target="_blank" rel="noopener noreferrer">
							<button className="px-12 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg rounded-md">
								Learn more in Docs
							</button>
						</a>
						<a href="https://cobar.vn/" target="_blank" rel="noopener noreferrer">
							<button className="px-12 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg rounded-md">
								Join as a Partner
							</button>
						</a>

						<div className="relative" ref={dropdownRef}>
							<button
								onClick={handleDownloadMezon}
								className="px-12 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg rounded-md"
							>
								Download Mezon
							</button>
							{isDropdownOpen && platform !== Platform.IOS && platform !== Platform.ANDROID && (
								<div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
									<a
										href={`${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64.exe`}
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-purple-600 hover:text-pink-600"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Icons.Windows className="w-5 h-5" />
										<span className="text-gray-700 font-medium">Windows</span>
									</a>
									<a
										href={`${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-arm64.dmg`}
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-purple-600 hover:text-pink-600"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Icons.Apple className="w-5 h-5" />
										<span className="text-gray-700 font-medium">macOS</span>
									</a>
									<a
										href={`${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-linux-amd64.deb`}
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-purple-600 hover:text-pink-600"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Icons.Linux className="w-5 h-5" />
										<span className="text-gray-700 font-medium">Linux</span>
									</a>
									<a
										href="https://apps.apple.com/vn/app/mezon/id6502750046"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-purple-600 hover:text-pink-600"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Icons.Apple className="w-5 h-5" />
										<span className="text-gray-700 font-medium">iOS (Mobile)</span>
									</a>
									<a
										href="https://play.google.com/store/apps/details?id=com.mezon.mobile"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-purple-600 hover:text-pink-600"
										onClick={() => setIsDropdownOpen(false)}
									>
										<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
										</svg>
										<span className="text-gray-700 font-medium">Android (Mobile)</span>
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<Footer downloadUrl={downloadUrl} universalUrl={universalUrl} portableUrl={portableUrl} />
		</div>
	);
};

export default EconomyPage;
