import { ActionEmitEvent } from '@mezon/mobile-components';
import { selectAllClans } from '@mezon/store-mobile';
import { LIMIT_CLAN_ITEM } from '@mezon/utils';
import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useSelector } from 'react-redux';
import ClanLimitModal from '../components/ClanLimitModal';

const useCheckClanLimit = () => {
	const allClans = useSelector(selectAllClans);
	const showClanLimitModal = () => {
		const data = {
			children: React.createElement(ClanLimitModal)
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	};

	const checkClanLimit = () => {
		const isClanLimit = allClans?.length >= LIMIT_CLAN_ITEM;
		if (isClanLimit) {
			showClanLimitModal();
		}
		return isClanLimit;
	};

	return { checkClanLimit };
};

export default useCheckClanLimit;
