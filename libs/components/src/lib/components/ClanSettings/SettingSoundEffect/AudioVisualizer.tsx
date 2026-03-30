import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface AudioVisualizerProps {
	blob: Blob | null;
	width: number;
	height: number;
	barWidth?: number;
	gap?: number;
	backgroundColor?: string;
	barColor?: string;
	barUnselectColor?: string;
	trimStart?: number;
	trimEnd?: number;
}

type BarPoint = { max: number; min: number };

function extractBars(audioBuffer: AudioBuffer, canvasWidth: number, canvasHeight: number, barWidth: number, gap: number): BarPoint[] {
	const samples = audioBuffer.getChannelData(0);
	const numBars = Math.floor(canvasWidth / (barWidth + gap));
	const samplesPerBar = Math.floor(samples.length / numBars);
	const half = canvasHeight / 2;

	let peak = 0;
	const raw: BarPoint[] = [];

	for (let i = 0; i < numBars; i++) {
		const negatives: number[] = [];
		const positives: number[] = [];

		for (let j = 0; j < samplesPerBar && i * samplesPerBar + j < samples.length; j++) {
			const v = samples[i * samplesPerBar + j];
			if (v <= 0) negatives.push(v);
			else positives.push(v);
		}

		const avgPos = positives.length ? positives.reduce((a, b) => a + b, 0) / positives.length : 0;
		const avgNeg = negatives.length ? negatives.reduce((a, b) => a + b, 0) / negatives.length : 0;

		if (avgPos > peak) peak = avgPos;
		if (Math.abs(avgNeg) > peak) peak = Math.abs(avgNeg);

		raw.push({ max: avgPos, min: avgNeg });
	}

	if (peak > 0 && half * 0.8 > peak * half) {
		const scale = (half * 0.8) / peak;
		return raw.map((b) => ({ max: b.max * scale, min: b.min * scale }));
	}

	return raw;
}

function drawBars(
	bars: BarPoint[],
	canvas: HTMLCanvasElement,
	barWidth: number,
	gap: number,
	backgroundColor: string,
	barColor: string,
	barUnselectColor: string,
	trimStart = 0,
	trimEnd = 1
): void {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const half = canvas.height / 2;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (backgroundColor !== 'transparent') {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	bars.forEach((bar, idx) => {
		const ratio = idx / bars.length;
		const inTrim = ratio >= trimStart && ratio < trimEnd;
		ctx.fillStyle = inTrim ? barColor : barUnselectColor;

		const x = idx * (barWidth + gap);
		const y = half + bar.min;
		const h = half + bar.max - y;

		ctx.beginPath();
		if (ctx.roundRect) {
			ctx.roundRect(x, y, barWidth, Math.max(1, h), 50);
			ctx.fill();
		} else {
			ctx.fillRect(x, y, barWidth, Math.max(1, h));
		}
	});
}

const resolveCssColor = (color: string, fallback = 'rgb(184, 184, 184)'): string => {
	if (typeof window === 'undefined') return fallback;
	const raw = color.trim();
	if (!raw.startsWith('var(')) {
		return raw || fallback;
	}

	const match = raw.match(/^var\(\s*([^,\s\)]+)(?:\s*,\s*([^\)]+))?\s*\)$/);
	if (!match) return fallback;

	const varName = match[1];
	const fallbackFromCss = match[2]?.trim() || fallback;
	const resolved = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
	return resolved || fallbackFromCss;
};

const AudioVisualizer = forwardRef<HTMLCanvasElement, AudioVisualizerProps>(
	(
		{
			blob,
			width,
			height,
			barWidth = 2,
			gap = 1,
			backgroundColor = 'transparent',
			barColor = 'var(--bg-theme-bar-play-color-dark-sound)',
			barUnselectColor = 'var(--bg-theme-unselect-dark-sound)',
			trimStart = 0,
			trimEnd = 1
		},
		ref
	) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);

		const barsRef = useRef<BarPoint[]>([]);

		useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement, []);

		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			if (!blob) {
				const placeholder: BarPoint[] = Array.from({ length: 100 }, () => ({ max: 0, min: 0 }));
				barsRef.current = placeholder;
				const rc = resolveCssColor(barColor);
				const rcu = resolveCssColor(barUnselectColor);
				drawBars(placeholder, canvas, barWidth, gap, backgroundColor, rc, rcu, trimStart, trimEnd);
				return;
			}

			let cancelled = false;

			(async () => {
				try {
					const arrayBuffer = await blob.arrayBuffer();
					const audioCtx = new AudioContext();
					audioCtx.decodeAudioData(arrayBuffer.slice(0), (audioBuffer) => {
						if (cancelled || !canvasRef.current) return;
						const bars = extractBars(audioBuffer, width, height, barWidth, gap);
						barsRef.current = bars;
						const rc2 = resolveCssColor(barColor);
						const rcu2 = resolveCssColor(barUnselectColor);
						drawBars(bars, canvasRef.current, barWidth, gap, backgroundColor, rc2, rcu2, trimStart, trimEnd);
						audioCtx.close();
					});
				} catch {
					// silently ignore decode errors
				}
			})();

			return () => {
				cancelled = true;
			};
		}, [blob, width, height, barWidth, gap]);

		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas || barsRef.current.length === 0) return;
			const rc3 = resolveCssColor(barColor);
			const rcu3 = resolveCssColor(barUnselectColor);
			drawBars(barsRef.current, canvas, barWidth, gap, backgroundColor, rc3, rcu3, trimStart, trimEnd);
		}, [barColor, barUnselectColor, backgroundColor, barWidth, gap, trimStart, trimEnd]);

		return <canvas ref={canvasRef} width={width} height={height} style={{ aspectRatio: 'unset', display: 'block' }} />;
	}
);

AudioVisualizer.displayName = 'AudioVisualizer';

export default AudioVisualizer;
