import { useTranslation } from 'react-i18next';

const Error = () => {
	const { t } = useTranslation('memberTable');
	return <div>{t('error')}</div>;
};

export default Error;
