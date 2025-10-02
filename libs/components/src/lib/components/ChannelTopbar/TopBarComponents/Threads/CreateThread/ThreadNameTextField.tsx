import { selectNameThreadError, threadsActions, useAppDispatch } from '@mezon/store';
import { ValidateSpecialCharacters, generateE2eId, threadError } from '@mezon/utils';
import { KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface ThreadNameTextFieldProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => Promise<void>;
	error?: string;
	className?: string;
}

const ThreadNameTextField = ({ label, placeholder, value, className, onChange, onKeyDown }: ThreadNameTextFieldProps) => {
	const { t } = useTranslation('channelTopbar');
	const dispatch = useAppDispatch();
	const nameThreadError = useSelector(selectNameThreadError);
	const [checkValidate, setCheckValidate] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const regex = ValidateSpecialCharacters().test(value);
		setCheckValidate(!regex);
		dispatch(threadsActions.setNameThreadError(''));
		onChange(value);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent<HTMLInputElement>) => {
			const element = event.target as HTMLInputElement;
			if (!(element.value || '').trim()) {
				dispatch(threadsActions.setNameThreadError(threadError.name));
			}
			onKeyDown(event);
		},
		[dispatch, onKeyDown]
	);

	return (
		<div className="flex flex-col mt-4 mb-4">
			<span className="text-xs font-semibold uppercase mb-2 text-theme-primary-active">{label}</span>
			<input
				value={value}
				onChange={handleInputChange}
				type="text"
				placeholder={t('createThread.placeholder.threadName')}
				className={className}
				onKeyDown={handleKeyDown}
				maxLength={Number(process.env.NX_MAX_LENGTH_NAME_ALLOWED)}
				data-e2e={generateE2eId('chat.channel_message.thread_box.input.thread_name')}
			/>
			{nameThreadError && <span className="mt-1 text-[#e44141] text-xs italic font-thin">{nameThreadError}</span>}
			{checkValidate && value.length > 0 && (
				<span className="mt-1 text-[#e44141] text-xs italic font-thin">{t('createThread.validation.invalidChannelName')}</span>
			)}
		</div>
	);
};

export default ThreadNameTextField;
