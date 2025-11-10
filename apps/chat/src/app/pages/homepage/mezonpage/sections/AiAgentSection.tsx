'use client';

import { Icons } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const AiAgentSection = () => {
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
		<section ref={sectionRef} className="relative w-full bg-white py-20 2xl:py-[193px] max-md:py-12 overflow-hidden">
			<div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto px-10">
				<div className="flex items-center justify-between 2xl:justify-around max-lg:flex-col-reverse max-lg:gap-12 flex-row-reverse gap-8 lg:gap-12 xl:gap-16">
					<div
						ref={imageRef}
						className={`flex-shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
					>
						<img
							src="/assets/ai-agent.webp"
							alt="Engage"
							className="max-w-[35vw] max-lg:max-w-[60vw] object-contain drop-shadow-2xl rounded-2xl"
						/>
					</div>

					<div
						ref={contentRef}
						className={`flex flex-col justify-center items-center pl-4 lg:pl-8 xl:pl-12 max-lg:px-4 transition-all duration-700 delay-300 ${
							isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
						}`}
					>
						<div className="max-w-[520px] 2xl:max-w-[22vw] flex flex-col items-start gap-4 md:gap-6 lg:gap-8">
							<div>
								<h2 className="font-svnAvo text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-stone-900 mb-3 md:mb-4 lg:mb-6">
									<span className="text-stone-900">AI Agents for Clan and Always-On Assistance</span>
								</h2>
								<p className="font-svnAvo text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
									Voice AI agent (Summarize content in voice channel conversations, or act as an interviewer in interviews),
									assistance , BOT shawdow mode (summary content in channel text).
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
