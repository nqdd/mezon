import { size, useTheme } from '@mezon/mobile-ui';
import { forwardRef, Fragment, memo, useImperativeHandle, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import AdvancedFunctionSwitcher from '../../AdvancedFunction/AdvancedFunctionSwitcher';
import AttachmentSwitcher from '../../AttachmentPicker/AttachmentSwitcher';
import { style } from '../ChatBoxBottomBar/style';

interface IChatMessageLeftAreaProps {
	isAvailableSending: boolean;
	modeKeyBoardBottomSheet: string;
	handleKeyboardBottomSheetMode: (mode: string) => void;
	hiddenAdvanceFunc?: boolean;
}

export interface IChatMessageLeftAreaRef {
	setAttachControlVisibility: (visible: boolean) => void;
}

export const ChatMessageLeftArea = memo(
	forwardRef<IChatMessageLeftAreaRef, IChatMessageLeftAreaProps>(
		({ isAvailableSending, modeKeyBoardBottomSheet, handleKeyboardBottomSheetMode, hiddenAdvanceFunc = false }, ref) => {
			const { themeValue } = useTheme();
			const styles = style(themeValue);
			const [isShowAttachControl, setIsShowAttachControl] = useState<boolean>(false);

			useImperativeHandle(ref, () => ({
				setAttachControlVisibility: (visible: boolean) => {
					if (visible === isShowAttachControl) return;

					setIsShowAttachControl(visible);
				}
			}));

			return (
				<View style={styles.wrapper}>
					{isAvailableSending && !isShowAttachControl ? (
						<TouchableOpacity
							style={[styles.btnIcon]}
							onPress={() => {
								handleKeyboardBottomSheetMode('text');
								setIsShowAttachControl(!isShowAttachControl);
							}}
						>
							<MezonIconCDN icon={IconCDN.chevronSmallLeftIcon} width={size.s_22} height={size.s_22} color={themeValue.textStrong} />
						</TouchableOpacity>
					) : (
						<Fragment>
							<AttachmentSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
							{!hiddenAdvanceFunc && (
								<AdvancedFunctionSwitcher onChange={handleKeyboardBottomSheetMode} mode={modeKeyBoardBottomSheet} />
							)}
						</Fragment>
					)}
				</View>
			);
		}
	)
);
