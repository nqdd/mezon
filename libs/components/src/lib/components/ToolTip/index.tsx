import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CustomTooltipProps {
	children: React.ReactNode;
	text: string;
	offsetX?: number;
}

export const CustomTooltip = ({ children, text, offsetX = 12 }: CustomTooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isVisible || !triggerRef.current) return;

		const updatePosition = () => {
			const rect = triggerRef.current?.getBoundingClientRect();
			if (!rect) return;

			setPosition({
				top: rect.top - 2,
				left: rect.left + rect.width / 2
			});
		};

		updatePosition();
		window.addEventListener('scroll', updatePosition, true);
		window.addEventListener('resize', updatePosition);

		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		};
	}, [isVisible]);

	return (
		<>
			<div ref={triggerRef} className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
				{children}
			</div>
			{isVisible &&
				createPortal(
					<div
						className="fixed pointer-events-none z-[9999]"
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
							transform: `translate(calc(-50% + ${offsetX}px), -100%)`
						}}
					>
						<div className="mb-2">
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
					</div>,
					document.body
				)}
		</>
	);
};
