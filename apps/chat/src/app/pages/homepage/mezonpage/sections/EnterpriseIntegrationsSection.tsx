'use client';

import { Icons } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const EnterpriseIntegrationsSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isVisible) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, [isVisible]);

	return (
		<section ref={sectionRef} className="relative w-full bg-white py-20 max-md:py-12 overflow-hidden">
			<div className="max-w-[1600px] mx-auto px-10">
				<div className="flex items-center justify-between max-lg:flex-col-reverse max-lg:gap-12 flex-row-reverse ">
					<div
						ref={imageRef}
						className={`flex-shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
					>
						<img
							src="https://cdn.mezon.ai/landing-page-mezon/integraytion.png"
							alt="Voice Channel"
							className="max-w-[35vw] max-lg:max-w-[60vw] object-contain drop-shadow-2xl rounded-2xl"
						/>
					</div>

					<div
						ref={contentRef}
						className={`flex flex-col justify-center items-center pl-8 lg:pl-16 xl:pl-24 max-lg:px-4 transition-all duration-700 delay-300 ${
							isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
						}`}
					>
						<div className="max-w-[520px] flex flex-col items-start gap-8">
							<div>
								<h2 className="font-svnAvo text-6xl max-md:text-3xl text-stone-900 mb-6">
									<span className="text-stone-900">Enterprise Integrations</span>
								</h2>
								<p className="font-svnAvo text-xl text-gray-600 leading-relaxed">
									Mezon enables you to connect with customers globally and deliver captivating large-scale experiences.
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
