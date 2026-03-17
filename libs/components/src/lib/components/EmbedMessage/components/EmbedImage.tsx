import { useModal } from 'react-modal-hook';
import { ImagePreview } from '../../ImagePreview';

interface EmbedImageProps {
	url: string;
	width?: number;
	height?: number;
}

export function EmbedImage({ url }: EmbedImageProps) {
	const [showPreview, closePreview] = useModal(() => {
		return <ImagePreview imageUrl={url} onClose={closePreview} />;
	});

	return (
		<div className="mt-2 rounded overflow-hidden max-w-full">
			<img src={url} alt="" className="w-full h-auto max-w-full object-contain cursor-pointer" onClick={showPreview} />
		</div>
	);
}
