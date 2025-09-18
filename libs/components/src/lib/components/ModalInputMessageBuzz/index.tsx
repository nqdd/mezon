import { useChatSending, useEmojiSuggestionContext, useOnClickOutside } from '@mezon/core';
import type { DirectEntity } from '@mezon/store';
import { selectTheme } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EmojiPlaces, ThemeApp, TypeMessage, filterEmptyArrays, processEntitiesDirectly } from '@mezon/utils';
import type { ApiChannelDescription } from 'mezon-js/api.gen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GifStickerEmojiPopup, SuggestItem } from '../../components';
import Mention, { type MentionData } from '../MessageBox/ReactionMentionInput/Mention';
import MentionsInput, { type MentionsInputHandle } from '../MessageBox/ReactionMentionInput/MentionsInput';

type ModalInputMessageBuzzProps = {
	currentChannel: DirectEntity | null;
	mode: number;
	closeBuzzModal: () => void;
};

const ModalInputMessageBuzz: React.FC<ModalInputMessageBuzzProps> = ({ currentChannel, mode, closeBuzzModal }) => {
	const { sendMessage } = useChatSending({ channelOrDirect: currentChannel || undefined, mode });
	const [inputValue, setInputValue] = useState('');
	const panelRef = useRef(null);
	const editorRef = useRef<MentionsInputHandle | null>(null);
	const emojiRef = useRef<HTMLDivElement | null>(null);
	const appearanceTheme = useSelector(selectTheme);
	const [isShowEmojiPanel, setIsShowEmojiPanel] = useState(false);

	const [mentionPosition, setMentionPosition] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0
	});

	const toggleEmojiPanel = () => {
		setIsShowEmojiPanel(!isShowEmojiPanel);
	};

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.focus();
		}
	}, []);

	const handleClosePopup = useCallback(() => {
		closeBuzzModal();
		setInputValue('');
	}, [closeBuzzModal]);

	const { emojis } = useEmojiSuggestionContext();
	const queryEmojis = (query: string) => {
		if (!query || emojis.length === 0) return [];
		const q = query.toLowerCase();
		const matches: { id: string; display: string; src?: string }[] = [];

		for (const { id, shortname, src } of emojis) {
			if (!shortname || !shortname.includes(q)) continue;
			if (!id) continue;
			matches.push({ id, display: shortname, src });
			if (matches.length === 20) break;
		}

		return matches;
	};

	const handleInputChange = (value: string) => {
		setInputValue(value);
	};

	const handleSendBuzzMsg = useCallback(async () => {
		if (!editorRef.current) return;

		// const formattedText = editorRef.current.getFormattedText();
		const formattedText = {} as any;
		const { text: newPlainTextValue, entities } = formattedText;

		if (newPlainTextValue?.trim() === '') {
			return;
		}

		if (entities && entities.length > 0) {
			const { emojis: emojiList } = processEntitiesDirectly(entities, newPlainTextValue, []);

			const payload = {
				t: newPlainTextValue,
				ej: emojiList
			};

			const removeEmptyOnPayload = filterEmptyArrays(payload);

			try {
				sendMessage(removeEmptyOnPayload, [], [], [], undefined, undefined, undefined, TypeMessage.MessageBuzz);
				handleClosePopup();
			} catch (error) {
				console.error('Error sending buzz message:', error);
			}
		} else {
			try {
				sendMessage({ t: newPlainTextValue.trim() }, [], [], [], undefined, undefined, undefined, TypeMessage.MessageBuzz);
				handleClosePopup();
			} catch (error) {
				console.error('Error sending buzz message:', error);
			}
		}
	}, [handleClosePopup, sendMessage]);

	useOnClickOutside(panelRef, handleClosePopup);
	useOnClickOutside(emojiRef, toggleEmojiPanel);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSendBuzzMsg();
		} else if (e.key === 'Escape') {
			handleClosePopup();
		}
	};

	return (
		<div
			tabIndex={-1}
			onKeyDown={handleKeyDown}
			className="w-[100vw] h-[100dvh] fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex justify-center items-center text-theme-primary"
		>
			{isShowEmojiPanel && (
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className={`right-[2px] absolute z-10`}
					style={{
						top: `calc(${mentionPosition.top}px - 250px)`,
						left: `calc(${mentionPosition.left}px + 290px)`
					}}
					onMouseDown={(e) => {
						e.stopPropagation();
					}}
				>
					<GifStickerEmojiPopup
						channelOrDirect={currentChannel as ApiChannelDescription}
						emojiAction={EmojiPlaces.EMOJI_EDITOR_BUZZ}
						mode={mode}
						buzzInputRequest={{ content: inputValue, mentionRaw: [], valueTextInput: inputValue }}
						setBuzzInputRequest={(request) => setInputValue(request.valueTextInput || '')}
						toggleEmojiPanel={toggleEmojiPanel}
					/>
				</div>
			)}

			<div ref={panelRef} className="bg-theme-setting-primary p-4 rounded-lg w-[400px]">
				<div className="flex justify-between mb-4">
					<h3 className="text-lg font-bold ">Enter your message buzz</h3>
					<button onClick={handleClosePopup} className=" hover:text-red-500">
						✕
					</button>
				</div>
				<div className="flex items-center gap-2 relative">
					<div onClick={toggleEmojiPanel} className="w-fit absolute z-[1] right-[90px] top-[14px] cursor-pointer">
						<Icons.Smile defaultSize="w-5 h-5" />
					</div>
					<MentionsInput
						ref={editorRef}
						value={inputValue}
						onChange={handleInputChange}
						className={`w-[calc(100%_-_70px)] bg-theme-input border-theme-primary rounded-lg p-[10px] customScrollLightMode ${appearanceTheme === ThemeApp.Light && 'lightModeScrollBarMention'}`}
						// maxLength={MAX_LENGTH_MESSAGE_BUZZ}
						placeholder="Enter your buzz message..."
					>
						<Mention
							trigger=":"
							data={queryEmojis}
							title=""
							displayTransform={(id: string, display: string) => `${display}`}
							renderSuggestion={(suggestion: MentionData, search: string, highlightedDisplay: React.ReactNode) => (
								<SuggestItem
									display={suggestion.display ?? ''}
									symbol={(suggestion as any).emoji}
									emojiId={suggestion.id as string}
								/>
							)}
							appendSpaceOnAdd={true}
						/>
					</MentionsInput>
					<button
						onClick={handleSendBuzzMsg}
						className="w-[70px] flex justify-center items-center px-4 py-2 btn-primary btn-primary-hover rounded-lg "
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default ModalInputMessageBuzz;
