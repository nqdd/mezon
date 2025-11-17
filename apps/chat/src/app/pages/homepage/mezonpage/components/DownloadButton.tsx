import mezonPackage from '@mezon/package-js';
import { Icons } from '@mezon/ui';
import { getPlatform } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';

interface DownloadButtonProps {
	buttonText?: string;
	className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ buttonText = 'Tải Xuống', className }) => {
	const platform = getPlatform();
	const version = mezonPackage.version;
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const downloadLinks = {
		windows: `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64.exe`,
		macos: `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-arm64.dmg`,
		linux: `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-linux-amd64.deb`
	};

	const handleDownload = () => {
		if (platform === 'iOS') {
			window.open('https://apps.apple.com/vn/app/mezon/id6502750046', '_blank');
		} else if (platform === 'Android') {
			window.open('https://play.google.com/store/apps/details?id=com.mezon.mobile', '_blank');
		} else {
			setIsDropdownOpen(!isDropdownOpen);
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={handleDownload}
				className={
					className ||
					'font-svnAvo inline-flex items-center justify-center gap-2 px-8 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-4 bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l text-white text-sm sm:text-base lg:text-lg font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]'
				}
			>
				<span>{buttonText}</span>
				<Icons.ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
			</button>

			{isDropdownOpen && (
				<div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 min-w-[250px] z-50 border border-purple-200">
					<div className="text-center mb-3 text-sm font-semibold text-gray-700">Choose your platform</div>
					<div className="flex flex-col gap-2">
						<a
							href={downloadLinks.windows}
							className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-purple-300 text-purple-500 hover:text-pink-500"
						>
							<Icons.Windows className="w-6 h-6" />
							<span className="font-medium text-gray-800 group-hover:text-purple-600">Windows</span>
						</a>
						<a
							href={downloadLinks.macos}
							className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-purple-300 text-purple-500 hover:text-pink-500"
						>
							<Icons.Apple className="w-6 h-6" />
							<span className="font-medium text-gray-800 group-hover:text-purple-600">macOS</span>
						</a>
						<a
							href={downloadLinks.linux}
							className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all border border-gray-200 hover:border-purple-300 text-purple-500 hover:text-pink-500"
						>
							<Icons.Linux className="w-6 h-6" />
							<span className="font-medium text-gray-800 group-hover:text-purple-600">Linux</span>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};
