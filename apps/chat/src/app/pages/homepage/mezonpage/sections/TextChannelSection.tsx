'use client';

import { Icons } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const TextChannelSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const [isVisible, setIsVisible] = useState(false);

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
		<section ref={sectionRef} className="relative w-full bg-[#e6ebf0] py-20 max-md:py-12 overflow-hidden">
			<div className="max-w-[1600px] mx-auto px-10">
				<div className="flex items-center gap-[26px] lg:gap-[144px] max-lg:flex-col-reverse">
					<div
						className={`w-3/5 max-lg:w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
					>
						<img
							src="https://cdn.mezon.ai/landing-page-mezon/message.png"
							alt="Text Channel"
							className="w-auto h-auto max-w-[60vw] max-lg:max-w-full object-contain drop-shadow-2xl rounded-2xl"
						/>
					</div>

					<div
						className={`w-2/5 max-lg:w-full transition-all duration-700 delay-300 ${
							isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
						}`}
					>
						<div className="flex flex-col items-start gap-8 px-[16px] lg:px-0]">
							<div>
								<h2 className="font-svnAvo text-6xl max-md:text-3xl text-stone-900 mb-6">
									<span className="text-stone-900">Super-Fast Messaging</span>
								</h2>
								<p className="font-svnAvo text-xl text-gray-600 leading-relaxed">
									Built for Chat, Collaborate and Connect. <p>Super-Fast Messaging. Zero Limits. Instant Delivery.</p>
								</p>
							</div>
							<Link
								to="/"
								className="font-svnAvo inline-flex items-center justify-center gap-2 px-12 py-[10px] lg:py-4 bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l text-white text-lg font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[280px]"
							>
								<span>Tìm hiểu thêm</span>
								<Icons.ArrowRight className="w-5 h-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
