import React, { useRef, useState } from 'react';
import { MessageAudioControl } from './MessageAudioControl';
import { MessageAudioUI } from './MessageAudioUI';

type MessageAudioProps = {
	audioUrl: string;
	posInPopUp?: boolean;
};

export const MessageAudio: React.FC<MessageAudioProps> = React.memo(({ audioUrl, posInPopUp = false }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState<number>(0);
	const audioControlRef = useRef<{ togglePlay: () => void }>(null);

	const handleTogglePlay = () => {
		if (audioControlRef.current) {
			audioControlRef.current.togglePlay();
		}
	};
	const handleSaveImage = async () => {
		try {
			const res = await fetch(audioUrl);
			if (!res.ok) throw new Error('Cannot fetch file');

			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = blobUrl;
			link.download = 'audio-file.mp3';
			document.body.appendChild(link);
			link.click();
			link.remove();

			URL.revokeObjectURL(blobUrl);
		} catch (err) {
			console.error('Download failed:', err);
		}
	};

	return (
		<>
			<MessageAudioControl
				ref={audioControlRef}
				audioUrl={audioUrl}
				setDuration={setDuration}
				setCurrentTime={setCurrentTime}
				setIsPlaying={setIsPlaying}
				isPlaying={isPlaying}
			/>
			<MessageAudioUI
				posInPopUp={posInPopUp}
				isPlaying={isPlaying}
				currentTime={currentTime}
				duration={duration}
				togglePlay={handleTogglePlay}
				handleSaveImage={handleSaveImage}
			/>
		</>
	);
});
