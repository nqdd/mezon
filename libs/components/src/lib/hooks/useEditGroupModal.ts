import { directActions, useAppDispatch } from '@mezon/store';
import { handleUploadEmoticon, useMezon } from '@mezon/transport';
import { ValidateSpecialCharacters } from '@mezon/utils';
import { useCallback, useState } from 'react';

export interface UseEditGroupModalProps {
	channelId?: string;
	currentGroupName?: string;
	currentAvatar?: string;
}

export interface UseEditGroupModalReturn {
	isEditModalOpen: boolean;
	groupName: string;
	imagePreview: string;
	selectedFile: File | null;
	
	openEditModal: () => void;
	closeEditModal: () => void;
	setGroupName: (name: string) => void;
	handleImageUpload: (file: File | null) => void;
	handleSave: () => Promise<void>;
	
	hasChanges: boolean;
}

export const useEditGroupModal = ({
	channelId,
	currentGroupName = '',
	currentAvatar = ''
}: UseEditGroupModalProps): UseEditGroupModalReturn => {
	const dispatch = useAppDispatch();
	const { sessionRef, clientRef } = useMezon();
	
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [groupName, setGroupName] = useState(currentGroupName);
	const [imagePreview, setImagePreview] = useState<string>(currentAvatar);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isAvatarRemoved, setIsAvatarRemoved] = useState<boolean>(false);

	const hasChanges = groupName.trim() !== currentGroupName || selectedFile !== null || isAvatarRemoved;

	const openEditModal = useCallback(() => {
		setGroupName(currentGroupName);
		setImagePreview(currentAvatar);
		setSelectedFile(null);
		setIsAvatarRemoved(false);
		setIsEditModalOpen(true);
	}, [currentGroupName, currentAvatar]);

	const closeEditModal = useCallback(() => {
		setIsEditModalOpen(false);
	}, []);

	const handleImageUpload = useCallback((file: File | null) => {
		if (file === null) {

			setImagePreview('');
			setSelectedFile(null);
			setIsAvatarRemoved(true);
			return;
		}

		setImagePreview('');
		setIsAvatarRemoved(false);

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			if (result) {
				setImagePreview(result);
			}
		};
		reader.readAsDataURL(file);

		setSelectedFile(file);
	}, []);

	const handleSave = useCallback(async () => {
		const value = groupName.trim();
		const regex = ValidateSpecialCharacters();

		if (!regex.test(value)) {
			console.error('Invalid channel name');
			return;
		}

		const hasNameChanged = value !== currentGroupName;
		const hasImageChanged = selectedFile !== null;
		if ((hasNameChanged || hasImageChanged || isAvatarRemoved) && channelId) {
			let avatarUrl = currentAvatar;

			if (isAvatarRemoved) {
				avatarUrl = '';
			} else if (selectedFile) {
				try {
					const client = clientRef.current;
					const session = sessionRef.current;

					if (!client || !session) {
						console.error('Client/session not ready');
						return;
					}

					const ext = selectedFile.name.split('.').pop() || 'jpg';
					const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
					const path = `dm-group-avatar/${channelId || 'temp'}/${unique}.${ext}`;

					const attachment = await handleUploadEmoticon(client, session, path, selectedFile);

					if (attachment && attachment.url) {
						avatarUrl = attachment.url;
					} else {
						return;
					}
				} catch (error) {
					console.error('Failed to upload image:', error);
					return;
				}
			}

			const payload: { channel_id: string; channel_label?: string; topic?: string } = { channel_id: channelId };
			if (hasNameChanged) payload.channel_label = value;
			if (hasImageChanged || isAvatarRemoved) payload.topic = avatarUrl;
			
			dispatch(directActions.updateDmGroup(payload));
		}

		closeEditModal();
	}, [groupName, selectedFile, isAvatarRemoved, currentGroupName, currentAvatar, channelId, dispatch, closeEditModal]);

	return {
		isEditModalOpen,
		groupName,
		imagePreview,
		selectedFile,
		
		openEditModal,
		closeEditModal,
		setGroupName,
		handleImageUpload,
		handleSave,
		
		hasChanges
	};
};
