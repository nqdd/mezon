'use client';

import { Icons, Image } from '@mezon/ui';
import { Platform, generateE2eId, getPlatform } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
	downloadUrl: string;
	universalUrl: string;
}

const Footer = ({ downloadUrl, universalUrl }: FooterProps) => {
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
								href="https://mezon.ai/blogs/mediakit"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Media Kit
							</a>
							<a
								href="https://mezon.ai/contact-us"
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
								href="https://doc-hosting.flycricket.io/mezon/87aa352a-ee20-4b2d-9866-e858f2dd5bd6/privacy"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors text-xs md:text-sm leading-relaxed block"
							>
								Privacy Policy
							</a>
							<a
								href="https://mezon.ai/terms-of-service"
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
							<a
								href="https://apps.microsoft.com/detail/9pf25lf1fj17?hl=en-US&gl=VN"
								target="_blank"
								rel="noreferrer"
								onClick={() => trackFooterDownloadEvent('Windows', 'Microsoft Store')}
								className="transition-transform duration-300 hover:scale-105"
							>
								<Image src={`assets/microsoft.svg`} className="w-24 md:w-36 lg:w-44" />
							</a>
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
						<div className="flex gap-4 md:gap-6 text-xs">
							<a href="/about" className="text-white/80 hover:text-white transition-colors">
								Privacy
							</a>
							<a href="/about" className="text-white/80 hover:text-white transition-colors">
								Terms
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
