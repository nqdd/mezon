import React, { Suspense, useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.min.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LazyDatePicker = React.lazy<React.ComponentType<any>>(() =>
	import('react-datepicker').then((mod) => {
		const resolved = mod as { default: React.ComponentType<any> & { default?: React.ComponentType<any> } };
		return { default: resolved.default?.default ?? resolved.default };
	})
);

type DatePickerWrapperProps = {
	selected: Date;
	onChange: (date: Date) => void;
	dateFormat: string;
	minDate?: Date;
	maxDate?: Date;
	className?: string;
	wrapperClassName?: string;
	open?: boolean;
	onClickOutside?: () => void;
	onCalendarClose?: () => void;
	onCalendarOpen?: () => void;
	onFocus?: () => void;
};

const DatePickerWrapper = (props: DatePickerWrapperProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (wrapperRef.current && !wrapperRef.current.contains(target)) {
				const calendarPopup = document.querySelector('.react-datepicker-popper');
				if (!calendarPopup || !calendarPopup.contains(target)) {
					setIsOpen(false);
				}
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside, true);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
	}, [isOpen]);

	const handleChange = (date: Date) => {
		props.onChange(date);
		setIsOpen(false);
	};

	return (
		<Suspense fallback={<div className="w-full h-[38px] bg-option-theme  animate-pulse rounded"></div>}>
			<div ref={wrapperRef}>
				<LazyDatePicker
					{...props}
					onChange={handleChange}
					open={isOpen}
					onInputClick={() => setIsOpen(true)}
					onClickOutside={() => setIsOpen(false)}
					popperClassName="z-[200]"
				/>
			</div>
		</Suspense>
	);
};

export default DatePickerWrapper;
