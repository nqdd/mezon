export default function UnreadMessageBreak() {
	return (
		<div className="relative flex items-center top-[-4px]">
			<div className="h-[1px] bg-red-500" style={{ width: 'calc(100% - 29px)' }}></div>
			<span
				style={{ fontSize: 8 }}
				className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-white uppercase bg-red-500 px-[4px] rounded before:content-[''] before:absolute before:left-[-4px] before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[6px] before:border-t-transparent before:border-r-[4px] before:border-r-red-500 before:border-b-[6px] before:border-b-transparent"
			>
				New
			</span>
		</div>
	);
}
