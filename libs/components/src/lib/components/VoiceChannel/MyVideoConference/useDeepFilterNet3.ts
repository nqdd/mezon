import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { selectNoiseSuppressionEnabled, useAppSelector } from '@mezon/store';
import { DeepFilterNoiseFilterProcessor } from 'deepfilternet3-noise-filter';
import type { LocalParticipant, LocalTrackPublication } from 'livekit-client';
import { RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef } from 'react';

interface UseDeepFilterNet3Options {
	noiseReductionLevel?: number;
	sampleRate?: number;
}

export const useDeepFilterNet3 = (options: UseDeepFilterNet3Options = {}) => {
	const { noiseReductionLevel = 50, sampleRate = 48000 } = options;
	const enabled = useAppSelector(selectNoiseSuppressionEnabled);
	const room = useRoomContext();
	const { localParticipant } = useLocalParticipant();
	const processorsRef = useRef<Map<string, DeepFilterNoiseFilterProcessor>>(new Map());

	useEffect(() => {
		if (!room || !localParticipant) {
			return;
		}

		const applyProcessorToAudioTrack = async (publication: LocalTrackPublication) => {
			if (publication.source !== Track.Source.Microphone) {
				return;
			}

			const track = publication.track;
			if (!track || track.kind !== 'audio') {
				return;
			}

			const trackSid = track.sid;
			if (!trackSid) {
				return;
			}

			if (!enabled) {
				const processor = processorsRef.current.get(trackSid);
				if (processor) {
					try {
						await track.stopProcessor().catch(() => {});
						processor.destroy?.().catch(() => {});
						processorsRef.current.delete(trackSid);
					} catch (error) {
						if (process.env.NODE_ENV === 'development') {
							console.error('Failed to remove DeepFilterNet3 processor:', error);
						}
					}
				}
				return;
			}

			if (processorsRef.current.has(trackSid)) {
				return;
			}

			try {
				const processor = new DeepFilterNoiseFilterProcessor({
					sampleRate,
					noiseReductionLevel,
					enabled: true
				});

				await track.setProcessor(processor);
				processor.setSuppressionLevel(noiseReductionLevel);
				processorsRef.current.set(trackSid, processor);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Failed to apply DeepFilterNet3 processor:', error);
				}
			}
		};

		const existingAudioTracks = Array.from(localParticipant.audioTrackPublications.values());
		for (const publication of existingAudioTracks) {
			if (publication.track && publication.source === Track.Source.Microphone) {
				void applyProcessorToAudioTrack(publication);
			}
		}

		const handleTrackPublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
			if (participant.sid === localParticipant.sid && publication.source === Track.Source.Microphone) {
				void applyProcessorToAudioTrack(publication);
			}
		};

		const handleTrackUnpublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
			if (participant.sid === localParticipant.sid && publication.source === Track.Source.Microphone) {
				const trackSid = publication.trackSid;
				const processor = processorsRef.current.get(trackSid);
				if (processor) {
					processor.destroy?.().catch(() => {});
					processorsRef.current.delete(trackSid);
				}
			}
		};

		room.on(RoomEvent.LocalTrackPublished, handleTrackPublished);
		room.on(RoomEvent.LocalTrackUnpublished, handleTrackUnpublished);

		const processorsMap = processorsRef.current;

		return () => {
			room.off(RoomEvent.LocalTrackPublished, handleTrackPublished);
			room.off(RoomEvent.LocalTrackUnpublished, handleTrackUnpublished);
			processorsMap.forEach((processor) => {
				processor.destroy?.().catch(() => {});
			});
			processorsMap.clear();
		};
	}, [room, localParticipant, enabled, sampleRate]);

	useEffect(() => {
		if (!enabled || !room || !localParticipant) {
			return;
		}

		processorsRef.current.forEach((processor) => {
			try {
				processor.setSuppressionLevel(noiseReductionLevel);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Failed to update suppression level:', error);
				}
			}
		});
	}, [noiseReductionLevel, enabled, room, localParticipant]);
};
