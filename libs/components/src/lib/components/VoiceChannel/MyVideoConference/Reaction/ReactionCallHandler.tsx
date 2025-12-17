import { getStoreAsync, selectCurrentChannelId, selectMemberClanByUserId } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { getSrcEmoji } from '@mezon/utils';
import type { VoiceReactionSend } from 'mezon-js';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { DisplayedEmoji, ReactionCallHandlerProps } from './types';

const MAX_EMOJIS_DISPLAYED = 20;
const EMOJI_RATE_LIMIT_MS = 150;

export const ReactionCallHandler: React.FC<ReactionCallHandlerProps> = memo(({ onSoundReaction }) => {
	const [displayedEmojis, setDisplayedEmojis] = useState<DisplayedEmoji[]>([]);
	const { socketRef } = useMezon();
	const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
	const emojiQueueRef = useRef<DisplayedEmoji[]>([]);
	const lastEmojiTimestampRef = useRef<number>(0);
	const channelId = useSelector(selectCurrentChannelId);
	const rafRef = useRef<number>();

	const generatePosition = useCallback(() => {
		const horizontalOffset = (Math.random() - 0.5) * 40;
		const baseLeft = 50;

		const animationVariant = Math.floor(Math.random() * 6) + 1;
		const animationName = `reactionFloatCurve${animationVariant}`;

		const duration = 2.5 + Math.random() * 3.5;

		return {
			left: `${baseLeft + horizontalOffset}%`,
			bottom: '15%',
			duration: `${duration.toFixed(1)}s`,
			animationName
		};
	}, []);

	const playSound = useCallback((soundUrl: string, soundId: string) => {
		try {
			let audio = audioRefs.current.get(soundId);
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			} else {
				audio = new Audio(soundUrl);
				audio.volume = 0.3;
				audioRefs.current.set(soundId, audio);
			}

			audio.play().catch((error) => {
				console.error('Failed to play sound reaction:', error);
			});
		} catch (error) {
			console.error('Error playing sound reaction:', error);
		}
	}, []);

	useEffect(() => {
		const handleAnimationFrame = () => {
			if (emojiQueueRef.current.length) {
				setDisplayedEmojis((prev) => {
					const merged = [...prev, ...emojiQueueRef.current];
					emojiQueueRef.current = [];
					return merged.slice(-MAX_EMOJIS_DISPLAYED);
				});
			}
			rafRef.current = requestAnimationFrame(handleAnimationFrame);
		};

		rafRef.current = requestAnimationFrame(handleAnimationFrame);

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!socketRef.current || !channelId) return;

		const currentSocket = socketRef.current;
		const audioMap = audioRefs.current;

		currentSocket.onvoicereactionmessage = (message: VoiceReactionSend) => {
			if (channelId === message.channel_id) {
				try {
					const emojis = message.emojis || [];
					const firstEmojiId = emojis[0];
					const senderId = message.sender_id;

					if (firstEmojiId) {
						if (firstEmojiId.startsWith('sound:')) {
							const soundUrl = firstEmojiId.replace('sound:', '');

							playSound(soundUrl, soundUrl);
							if (onSoundReaction && senderId) {
								onSoundReaction(senderId, soundUrl);
							}
						} else {
							const now = Date.now();
							if (now - lastEmojiTimestampRef.current < EMOJI_RATE_LIMIT_MS) {
								return;
							}
							lastEmojiTimestampRef.current = now;

							(async () => {
								const position = generatePosition();
								const state = (await getStoreAsync()).getState();
								const members = selectMemberClanByUserId(state, senderId);
								const newEmoji: DisplayedEmoji = {
									id: `${now}-${firstEmojiId}-${Math.random()}`,
									emoji: '',
									emojiId: firstEmojiId,
									timestamp: now,
									displayName: members?.clan_nick || members?.user?.display_name || members?.user?.username || '',
									position
								};

								emojiQueueRef.current.push(newEmoji);

								const durationMs = parseFloat(position.duration) * 1000 + 500;
								setTimeout(() => {
									setDisplayedEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
								}, durationMs);
							})();
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
		};

		return () => {
			if (currentSocket) {
				currentSocket.onvoicereactionmessage = () => {};
			}
			audioMap.forEach((audio) => {
				audio.pause();
			});
			audioMap.clear();
		};
	}, [socketRef, channelId, generatePosition, playSound, onSoundReaction]);

	if (displayedEmojis.length === 0) {
		return null;
	}

	return (
		<div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
			{displayedEmojis.map((item) => (
				<div
					key={item.id}
					className="text-5xl flex flex-col gap-2 items-center absolute h-[60px] origin-center will-change-[transform,opacity] backface-hidden contain-[layout_style_paint]"
					style={{
						bottom: item.position?.bottom || '15%',
						left: item.position?.left || '50%',
						animation: `${item.position?.animationName || 'reactionFloatCurve1'} ${item.position?.duration || '3.5s'} linear forwards`,
						animationDelay: item.position?.delay || '0ms'
					}}
				>
					<img
						src={getSrcEmoji(item.emojiId)}
						alt={''}
						className="w-10 h-10 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] will-change-transform backface-hidden"
					/>
					{item.displayName && (
						<div className="w-full rounded-full h-3 text-theme-primary-active bg-theme-setting-nav text-[10px] flex items-center justify-center px-2 py-1">
							{item.displayName}
						</div>
					)}
				</div>
			))}
		</div>
	);
});
