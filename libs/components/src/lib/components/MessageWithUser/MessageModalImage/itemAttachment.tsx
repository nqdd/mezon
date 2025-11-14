import type { AttachmentEntity } from '@mezon/store';
import { attachmentActions, useAppDispatch } from '@mezon/store';
import { EMimeTypes, ETypeLinkMedia, createImgproxyUrl } from '@mezon/utils';

type ItemAttachmentProps = {
	attachment: AttachmentEntity;
	previousDate: any;
	selectedImageRef: React.MutableRefObject<HTMLDivElement | null>;
	showDate: boolean;
	setUrlImg: React.Dispatch<React.SetStateAction<string>>;
	handleDrag: (e: any) => void;
	index: number;
	setCurrentIndexAtt: React.Dispatch<React.SetStateAction<number>>;
	currentIndexAtt: number;
};

const ItemAttachment = (props: ItemAttachmentProps) => {
	const { attachment, previousDate, selectedImageRef, showDate, setUrlImg, handleDrag, setCurrentIndexAtt, index, currentIndexAtt } = props;
	const dispatch = useAppDispatch();
	const isSelected = index === currentIndexAtt;
	const handleSelectImage = () => {
		setUrlImg(attachment.url || '');
		setCurrentIndexAtt(index);
		dispatch(attachmentActions.setCurrentAttachment(attachment));
	};

	const isVideo =
		(attachment as any).isVideo ||
		attachment.filetype?.startsWith(ETypeLinkMedia.VIDEO_PREFIX) ||
		attachment.filetype?.includes(EMimeTypes.mp4) ||
		attachment.filetype?.includes(EMimeTypes.mov);

	return (
		<div className={`attachment-item w-fit h-fit `} ref={isSelected ? selectedImageRef : null}>
			{showDate && <div className={`dark:text-white text-black mb-1 text-center`}>{previousDate}</div>}
			<div
				className={`rounded-md cursor-pointer ${isSelected ? 'flex items-center border-2 border-white' : 'relative'}`}
				onClick={handleSelectImage}
			>
				{isVideo ? (
					<div className="relative">
						<video
							src={attachment.url ?? ''}
							className={`size-[88px] max-w-[88px] max-h-[88px] max-[480px]:size-16 mx-auto gap-5 object-cover rounded-md cursor-pointer ${isSelected ? '' : 'overlay'} border-2 ${isSelected ? 'dark:bg-slate-700 bg-bgLightModeButton border-colorTextLightMode' : 'border-transparent'}`}
							muted
							playsInline
							preload="metadata"
							onDragStart={handleDrag}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									handleSelectImage();
								}
							}}
						/>
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					</div>
				) : (
					<img
						src={createImgproxyUrl(attachment.url ?? '', { width: 300, height: 300, resizeType: 'fit' })}
						alt={attachment.url}
						className={`size-[88px] max-w-[88px] max-h-[88px] max-[480px]:size-16  mx-auto gap-5 object-cover rounded-md cursor-pointer ${isSelected ? '' : 'overlay'} border-2 ${isSelected ? 'dark:bg-slate-700 bg-bgLightModeButton border-colorTextLightMode' : 'border-transparent'}`}
						onDragStart={handleDrag}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleSelectImage();
							}
						}}
					/>
				)}
				{!isSelected && <div className="absolute inset-0 bg-black opacity-80 rounded"></div>}
			</div>
		</div>
	);
};

export default ItemAttachment;
