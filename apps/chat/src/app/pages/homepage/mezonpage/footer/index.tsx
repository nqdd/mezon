'use client';

import { Icons, Image } from '@mezon/ui';
import { Platform, generateE2eId, getPlatform } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownButton } from '../components';

interface FooterProps {
	downloadUrl: string;
	universalUrl: string;
	portableUrl: string;
}

const Footer = ({ downloadUrl, universalUrl, portableUrl }: FooterProps) => {
	const { t } = useTranslation('homepage');
	const platform = getPlatform();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const trackFooterDownloadEvent = (platform: string, downloadType: string) => {
		if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
			(window as any).gtag('event', 'download_click', {
				event_category: 'Footer Downloads',
				event_label: platform,
				download_type: downloadType,
				custom_parameter_1: 'mezon_footer'
			});
		}
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<footer className="bg-[#131221]">
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-white/20">
					<div>
						<h3 className="font-semibold text-xs md:text-md uppercase tracking-wider mb-4 md:mb-5 text-white">Platform</h3>
						<div className="space-y-2 md:space-y-3">
							<a href="/about" className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block">
								About
							</a>
							<a
								href="https://mezon.ai/blogs/"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Blog
							</a>
							<a
								href="https://mezon.ai/developers"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								{t('footer.links.developerApi')}
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-xs md:text-md uppercase tracking-wider mb-4 md:mb-5 text-white">Resources</h3>
						<div className="space-y-2 md:space-y-3">
							<a
								href="https://github.com/mezonai/mezon"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Github
							</a>
							<a
								href="https://mezon.ai/docs/user/account-and-personalization"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								User Docs
							</a>
							<a
								href="https://mezon.ai/docs/user/bots-and-apps"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Developer Docs
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-xs md:text-md uppercase tracking-wider mb-4 md:mb-5 text-white">Company</h3>
						<div className="space-y-2 md:space-y-3">
							<a
								href="brand-center"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Brand Center
							</a>
							<a
								href="/contact-us"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Contact
							</a>
							<a
								href="https://mezon.ai/clans/"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Mezon Clan
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-xs md:text-md uppercase tracking-wider mb-4 md:mb-5 text-white">Legal</h3>
						<div className="space-y-2 md:space-y-3">
							<a
								href="/privacy-policy"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Privacy Policy
							</a>
							<a
								href="/terms-of-service"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Terms of Service
							</a>
						</div>
					</div>
				</div>

				<div className="mb-8 md:mb-12">
					<div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-[100px]">
						<a
							href="https://apps.apple.com/vn/app/mezon/id6502750046"
							target="_blank"
							rel="noreferrer"
							onClick={() => trackFooterDownloadEvent('iOS', 'App Store')}
							className="transition-transform duration-300 hover:scale-105"
						>
							<Image src={`assets/app-store.svg`} className="w-24 md:w-36 lg:w-44" />
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=com.mezon.mobile"
							target="_blank"
							rel="noreferrer"
							onClick={() => trackFooterDownloadEvent('Android', 'Google Play')}
							className="transition-transform duration-300 hover:scale-105"
						>
							<Image src={`assets/google-play.svg`} className="w-24 md:w-36 lg:w-44" />
						</a>
						{platform === Platform.MACOS ? (
							<div className="relative inline-block leading-none" ref={dropdownRef}>
								<button onClick={toggleDropdown} className="transition-transform duration-300 hover:scale-105">
									<Icons.MacAppStoreDesktop className="max-w-full h-8 md:h-12 lg:h-14 w-fit" />
								</button>

								{isOpen && (
									<div className="absolute mt-3 bg-[#6B21A8] rounded-lg shadow-lg border border-white/20 p-2 z-[9999]">
										<a
											className="cursor-pointer leading-none block p-2 hover:bg-[#7E22CE] rounded transition-colors"
											href={downloadUrl}
											target="_blank"
											rel="noreferrer"
											onClick={() => trackFooterDownloadEvent('macOS', 'Apple Silicon')}
										>
											<Icons.MacAppleSilicon className="max-w-full h-8 md:h-10 w-fit" />
										</a>
										<a
											className="cursor-pointer leading-none block mt-2 p-2 hover:bg-[#7E22CE] rounded transition-colors"
											href={universalUrl}
											target="_blank"
											rel="noreferrer"
											onClick={() => trackFooterDownloadEvent('macOS', 'Intel')}
										>
											<Icons.MacAppleIntel className="max-w-full h-8 md:h-10 w-fit" />
										</a>
									</div>
								)}
							</div>
						) : platform === 'Linux' ? (
							<a
								className="cursor-pointer transition-transform duration-300 hover:scale-105"
								href={downloadUrl}
								target="_blank"
								rel="noreferrer"
								onClick={() => trackFooterDownloadEvent('Linux', 'DEB Package')}
							>
								<Image src={`assets/linux.svg`} className="w-24 md:w-36 lg:w-44" />
							</a>
						) : (
							<DropdownButton
								icon={
									<a
										href="https://apps.microsoft.com/detail/9pf25lf1fj17"
										target="_blank"
										rel="noreferrer"
										onClick={() => trackFooterDownloadEvent('Windows', 'Microsoft Store')}
										className="transition-transform duration-300 hover:scale-105"
									>
										<Icons.MicrosoftDropdown className="max-w-full h-8 md:h-12 lg:h-14 w-fit" />
									</a>
								}
								downloadLinks={[
									{
										url: portableUrl,
										icon: <Icons.MicrosoftWinPortable className="max-w-full h-8 md:h-10 w-fit" />,
										trackingData: { platform: 'Windows', type: 'Portable' }
									}
								]}
								dropdownRef={dropdownRef}
								downloadUrl={downloadUrl}
								onDownloadClick={trackFooterDownloadEvent}
								t={t}
							/>
						)}
					</div>
				</div>

				<div className="border-t border-white/20 pt-4 md:pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
						<div
							className="text-white/80 text-xs font-medium text-center md:text-left"
							data-e2e={generateE2eId('homepage.footer.text.copyright')}
						>
							© 2025 Mezon. All rights reserved.
						</div>
						<div className="flex gap-4 md:gap-6 items-center">
							<a
								href="https://github.com/mezonai/mezon"
								target="_blank"
								rel="noreferrer"
								className="text-white/80 hover:text-white transition-colors"
								aria-label="Github"
							>
								<svg
									viewBox="0 0 20 20"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									className="w-5 h-5"
								>
									<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
									<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
									<g id="SVGRepo_iconCarrier">
										<title>github [#142]</title>
										<desc>Created with Sketch.</desc>
										<defs></defs>
										<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
											<g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="currentColor">
												<g id="icons" transform="translate(56.000000, 160.000000)">
													<path
														d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
														id="github-[#142]"
													></path>
												</g>
											</g>
										</g>
									</g>
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/company/mezon-ai"
								target="_blank"
								rel="noreferrer"
								className="text-white/80 hover:text-white transition-colors"
								aria-label="Linkedin"
							>
								<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
									<g>
										<path
											d="M22 3.47059V20.5294C22 20.9194 21.8451 21.2935 21.5693 21.5693C21.2935 21.8451 20.9194 22 20.5294 22H3.47059C3.08056 22 2.70651 21.8451 2.43073 21.5693C2.15494 21.2935 2 20.9194 2 20.5294V3.47059C2 3.08056 2.15494 2.70651 2.43073 2.43073C2.70651 2.15494 3.08056 2 3.47059 2H20.5294C20.9194 2 21.2935 2.15494 21.5693 2.43073C21.8451 2.70651 22 3.08056 22 3.47059ZM7.88235 9.64706H4.94118V19.0588H7.88235V9.64706ZM8.14706 6.41177C8.14861 6.18929 8.10632 5.96869 8.02261 5.76255C7.93891 5.55642 7.81542 5.36879 7.65919 5.21039C7.50297 5.05198 7.31708 4.92589 7.11213 4.83933C6.90718 4.75277 6.68718 4.70742 6.46471 4.70588H6.41177C5.95934 4.70588 5.52544 4.88561 5.20552 5.20552C4.88561 5.52544 4.70588 5.95934 4.70588 6.41177C4.70588 6.86419 4.88561 7.29809 5.20552 7.61801C5.52544 7.93792 5.95934 8.11765 6.41177 8.11765C6.63426 8.12312 6.85565 8.0847 7.06328 8.00458C7.27092 7.92447 7.46074 7.80422 7.62189 7.65072C7.78304 7.49722 7.91237 7.31346 8.00248 7.10996C8.09259 6.90646 8.14172 6.6872 8.14706 6.46471V6.41177ZM19.0588 13.3412C19.0588 10.5118 17.2588 9.41177 15.4706 9.41177C14.8851 9.38245 14.3021 9.50715 13.7799 9.77345C13.2576 10.0397 12.8143 10.4383 12.4941 10.9294H12.4118V9.64706H9.64706V19.0588H12.5882V14.0529C12.5457 13.5403 12.7072 13.0315 13.0376 12.6372C13.3681 12.2429 13.8407 11.9949 14.3529 11.9471H14.4647C15.4 11.9471 16.0941 12.5353 16.0941 14.0176V19.0588H19.0353L19.0588 13.3412Z"
											fill="currentColor"
										/>
									</g>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
