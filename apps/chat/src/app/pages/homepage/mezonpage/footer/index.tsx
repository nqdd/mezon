'use client';

import { Icons, Image } from '@mezon/ui';
import { Platform, generateE2eId, getPlatform } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
			<div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
				<div className="mb-12 text-start">
					<Link to={'/'} className="flex items-center gap-[4.92px] min-w-[120px]">
						<Image src={`assets/logo.png`} width={120} height={35} className="object-cover" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-white/20">
					<div>
						<h3 className="font-semibold text-md uppercase tracking-wider mb-5 text-white">Platform</h3>
						<div className="space-y-3">
							<a href="/about" className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block">
								About
							</a>
							<a
								href="https://mezon.ai/blogs/"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Blog
							</a>
							<a
								href="https://mezon.ai/developers"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								{t('footer.links.developerApi')}
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-md uppercase tracking-wider mb-5 text-white">Resources</h3>
						<div className="space-y-3">
							<a
								href="https://github.com/mezonai/mezon"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Github
							</a>
							<a
								href="https://mezon.ai/docs/user/account-and-personalization"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								User Docs
							</a>
							<a
								href="https://mezon.ai/docs/user/bots-and-apps"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Developer Docs
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-md uppercase tracking-wider mb-5 text-white">Company</h3>
						<div className="space-y-3">
							<a
								href="https://mezon.ai/blogs/mediakit"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Media Kit
							</a>
							<a
								href="https://mezon.ai/blogs/contact"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Contact
							</a>
							<a
								href="https://mezon.ai/blogs/mezon-clan"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Mezon Clan
							</a>
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-md uppercase tracking-wider mb-5 text-white">Legal</h3>
						<div className="space-y-3">
							<a
								href="https://mezon.ai/blogs/privacy-policy"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Privacy Policy
							</a>
							<a
								href="https://mezon.ai/blogs/terms-of-service"
								target="_blank"
								rel="noreferrer"
								className="text-white/90 hover:text-white transition-colors  text-sm leading-relaxed block"
							>
								Terms of Service
							</a>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-[100px]">
						<a
							href="https://apps.apple.com/vn/app/mezon/id6502750046"
							target="_blank"
							rel="noreferrer"
							onClick={() => trackFooterDownloadEvent('iOS', 'App Store')}
							className="transition-transform duration-300 hover:scale-105"
						>
							<Image src={`assets/app-store.svg`} className="w-36 md:w-44" />
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=com.mezon.mobile"
							target="_blank"
							rel="noreferrer"
							onClick={() => trackFooterDownloadEvent('Android', 'Google Play')}
							className="transition-transform duration-300 hover:scale-105"
						>
							<Image src={`assets/google-play.svg`} className="w-36 md:w-44" />
						</a>
						{platform === Platform.MACOS ? (
							<div className="relative inline-block leading-none" ref={dropdownRef}>
								<button onClick={toggleDropdown} className="transition-transform duration-300 hover:scale-105">
									<Icons.MacAppStoreDesktop className="max-w-full h-12 md:h-14 w-fit" />
								</button>

								{isOpen && (
									<div className="absolute mt-3 bg-[#6B21A8] rounded-lg shadow-lg border border-white/20 p-2 z-10">
										<a
											className="cursor-pointer leading-none block p-2 hover:bg-[#7E22CE] rounded transition-colors"
											href={downloadUrl}
											target="_blank"
											rel="noreferrer"
											onClick={() => trackFooterDownloadEvent('macOS', 'Apple Silicon')}
										>
											<Icons.MacAppleSilicon className="max-w-full h-10 w-fit" />
										</a>
										<a
											className="cursor-pointer leading-none block mt-2 p-2 hover:bg-[#7E22CE] rounded transition-colors"
											href={universalUrl}
											target="_blank"
											rel="noreferrer"
											onClick={() => trackFooterDownloadEvent('macOS', 'Intel')}
										>
											<Icons.MacAppleIntel className="max-w-full h-10 w-fit" />
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
								<Image src={`assets/linux.svg`} className="w-36 md:w-44" />
							</a>
						) : (
							<DropdownButton
								icon={
									<a
										className="cursor-pointer transition-transform duration-300 hover:scale-105 inline-block"
										href={downloadUrl}
										target="_blank"
										rel="noreferrer"
										onClick={() => trackFooterDownloadEvent('Windows', 'EXE Installer')}
									>
										<Icons.MicrosoftDropdown className="max-w-full h-12 md:h-14 w-fit" />
									</a>
								}
								downloadLinks={[
									{
										url: portableUrl,
										icon: <Icons.MicrosoftWinPortable className="max-w-full h-10 w-fit" />,
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

				<div className="border-t border-white/20 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="text-white/80 text-xs font-medium" data-e2e={generateE2eId('homepage.footer.text.copyright')}>
							© 2025 Mezon. All rights reserved.
						</div>
						<div className="flex gap-6">
							<a href="/about" className="text-white/80 hover:text-white text-xs transition-colors">
								Privacy
							</a>
							<a href="/about" className="text-white/80 hover:text-white text-xs transition-colors">
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
