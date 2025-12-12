import { useState } from 'react';

interface CustomTooltipProps {
	children: React.ReactNode;
	text: string;
	offsetX?: number;
}

export const CustomTooltip = ({ children, text, offsetX = 12 }: CustomTooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
			{children}
			{isVisible && (
				<div
					className="absolute bottom-full left-1/2 mb-2 pointer-events-none z-50"
					style={{ transform: `translateX(calc(-50% + ${offsetX}px))` }}
				>
					<div className="bg-tooltip-channelapp rounded-lg px-3 py-2 shadow-lg border-theme-primary">
						<span className="text-theme-primary text-sm font-medium block truncate max-w-[100px]">{text}</span>
					</div>
					<div className="absolute top-full left-1/2 -mt-[1px]" style={{ transform: `translateX(calc(-50% - ${offsetX}px))` }}>
						<div
							className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-theme-primary"
							style={{ borderTopColor: 'var(--bg-tooltip-app)' }}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
