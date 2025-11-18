import { FloatButton } from '@mezon/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

type MentionFloatButtonProps = {
	onClick: () => void;
};

export const MentionFloatButton = React.memo<MentionFloatButtonProps>(({ onClick }) => {
	const { t } = useTranslation('common');
	return <FloatButton content={t('newMention')} onClick={onClick} className={'uppercase'} />;
});
