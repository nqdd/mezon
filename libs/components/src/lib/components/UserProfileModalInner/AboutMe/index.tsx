import { useTranslation } from 'react-i18next';

type AboutMeProps = {
	createTime?: string;
};

const AboutMe = ({ createTime }: AboutMeProps) => {
	const { t } = useTranslation('common');
	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', options);
	};

	return (
		<div className="flex flex-col gap-[20px]">
			<div className="flex flex-col gap-2">
				<p className="text-xs font-semibold text-theme-primary">{t('userProfile.memberSince')}</p>
				<span className="text-sm font-normal text-theme-primary">{formatDate(createTime || '')}</span>
			</div>
		</div>
	);
};

export default AboutMe;
