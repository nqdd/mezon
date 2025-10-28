import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, Keyboard, Platform, View } from 'react-native';
import { createStyles } from './PanelKeyboard.styles';
import AttachmentPicker from './components/AttachmentPicker';
import EmojiPicker from './components/EmojiPicker';
import type { EMessageActionType } from './enums';
import type { IMessageActionNeedToResolve } from './types';

interface IProps {
	directMessageId?: string;
	currentChannelId: string;
	currentClanId: string;
	messageAction?: EMessageActionType;
}
const PanelKeyboard = React.memo((props: IProps) => {
	const { themeValue, themeBasic } = useTheme();
	const [heightKeyboardShow, setHeightKeyboardShow] = useState<number>(0);
	const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<string>('text');
	const bottomPickerRef = useRef<BottomSheetModal>(null);
	const [messageActionNeedToResolve, setMessageActionNeedToResolve] = useState<IMessageActionNeedToResolve | null>(null);

	const styles = useMemo(
		() => createStyles(themeValue, themeBasic, heightKeyboardShow, typeKeyboardBottomSheet),
		[themeValue, themeBasic, heightKeyboardShow, typeKeyboardBottomSheet]
	);

	const onShowKeyboardBottomSheet = useCallback(async (isShow: boolean, type?: string) => {
		const keyboardHeight = Platform.OS === 'ios' ? 365 : 300;
		if (isShow) {
			bottomPickerRef?.current?.present();
			setHeightKeyboardShow(keyboardHeight);
			setTypeKeyboardBottomSheet(type);
			Keyboard.dismiss();
		} else {
			bottomPickerRef?.current?.dismiss();
			bottomPickerRef?.current?.close();
			setHeightKeyboardShow(0);
			setTypeKeyboardBottomSheet('text');
		}
	}, []);

	useEffect(() => {
		const eventListener = DeviceEventEmitter.addListener(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, ({ isShow = false, mode = '' }) => {
			onShowKeyboardBottomSheet(isShow, mode as string);
		});

		return () => {
			eventListener.remove();
		};
	}, [onShowKeyboardBottomSheet]);

	const onClose = useCallback(
		(isFocusKeyboard = true) => {
			onShowKeyboardBottomSheet(false, 'text');
			isFocusKeyboard && DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, {});
		},
		[onShowKeyboardBottomSheet]
	);

	useEffect(() => {
		const showKeyboard = DeviceEventEmitter.addListener(ActionEmitEvent.SHOW_KEYBOARD, (value) => {
			setMessageActionNeedToResolve(value);
		});
		return () => {
			showKeyboard.remove();
		};
	}, []);

	const handleSheetChange = (index: number) => {
		if (index === -1) {
			setHeightKeyboardShow(0);
			setTypeKeyboardBottomSheet('text');
			DeviceEventEmitter.emit(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, { isShow: false, mode: '' });
		} else if (index === 0 && typeKeyboardBottomSheet !== 'text') {
			Keyboard.dismiss();
		}
	};

	return (
		<>
			<View style={styles.spacerView} />
			<BottomSheetModal
				ref={bottomPickerRef}
				snapPoints={[heightKeyboardShow ? heightKeyboardShow : 1, '100%']}
				index={0}
				animateOnMount
				animationConfigs={{
					duration: 200
				}}
				backgroundStyle={styles.bottomSheetBackground}
				backdropComponent={null}
				enableDynamicSizing={false}
				enablePanDownToClose={true}
				handleIndicatorStyle={styles.handleIndicator}
				onChange={handleSheetChange}
			>
				<BottomSheetScrollView
					scrollEnabled={true}
					stickyHeaderIndices={[0]}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={typeKeyboardBottomSheet === 'emoji' ? styles.scrollViewContentFlex : undefined}
					style={styles.scrollViewMinHeight}
				>
					{typeKeyboardBottomSheet === 'attachment' ? (
						<AttachmentPicker currentChannelId={props?.currentChannelId} onCancel={onClose} messageAction={props?.messageAction} />
					) : typeKeyboardBottomSheet === 'emoji' ? (
						<EmojiPicker
							onDone={onClose}
							bottomSheetRef={bottomPickerRef}
							directMessageId={props?.directMessageId || ''}
							messageActionNeedToResolve={messageActionNeedToResolve}
						/>
					) : (
						<View />
					)}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
});
export default PanelKeyboard;
