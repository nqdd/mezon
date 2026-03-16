import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';

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

	const handleChange = (date: Date | null) => {
		props.onChange(date ?? new Date());
		setIsOpen(false);
	};

	return (
		<div ref={wrapperRef}>
			<DatePicker
				{...props}
				onChange={handleChange}
				open={isOpen}
				onInputClick={() => setIsOpen(true)}
				onClickOutside={() => setIsOpen(false)}
				popperClassName="z-[200]"
			/>
		</div>
	);
};

export default DatePickerWrapper;
