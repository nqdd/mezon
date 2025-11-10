'use client';

import { Icons } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const TextChannelSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isVisible) setIsVisible(true);
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, [isVisible]);

	return (
		<section ref={sectionRef} className="relative w-full bg-[#e6ebf0] py-20 2xl:py-[193px] max-md:py-12 overflow-hidden lg:px-5">
			<div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto px-10">
				<div className="flex items-center gap-[26px] lg:gap-[144px] max-lg:flex-col-reverse">
					<div
						className={`w-3/5 max-lg:w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
					>
						<img
							src="https://cdn.mezon.ai/landing-page-mezon/messagenew.webp"
							alt="Text Channel"
							className={`w-auto h-auto max-w-[60vw] lg:max-w-[50vw] 3xl:max-w-[30vw] object-contain drop-shadow-2xl rounded-2xl ${!imageLoaded ? 'bg-gradient-to-br from-[#8661df] to-[#7979ed]' : ''}`}
							loading="lazy"
							onLoad={() => setImageLoaded(true)}
						/>
					</div>

					<div
						className={`w-2/5 max-lg:w-full transition-all duration-700 delay-300 ${
							isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
						}`}
					>
						<div className="flex flex-col items-start gap-4 md:gap-6 lg:gap-8 px-4 lg:px-0">
							<div>
								<h2 className="font-svnAvo text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-stone-900 mb-3 md:mb-4 lg:mb-6">
									<span className="text-stone-900">Super-Fast Messaging</span>
								</h2>
								<p className="font-svnAvo text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
									Built for Chat, Collaborate and Connect. <p>Super-Fast Messaging. Zero Limits. Instant Delivery.</p>
								</p>
							</div>
							<Link
								to="/"
								className="font-svnAvo inline-flex items-center justify-center gap-2 px-8 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-4 bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l text-white text-sm sm:text-base lg:text-lg font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]"
							>
								<span>Tìm hiểu thêm</span>
								<Icons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
