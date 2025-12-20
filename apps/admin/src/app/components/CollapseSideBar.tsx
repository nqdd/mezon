import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { ITabs } from '../common/constants/tabSideBar';

interface ICollapseSideBarProps {
	isShow: boolean;
	toggleSideBar: () => void;
	tabs: ITabs[];
	currentAppId?: string;
}

const CollapseSideBar = ({ isShow, toggleSideBar, tabs, currentAppId }: ICollapseSideBarProps) => {
	const { t } = useTranslation('adminApplication');
	return (
		<div>
			{isShow && <div onClick={toggleSideBar} className="fixed inset-0 bg-black opacity-80 z-10" />}
			<div
				className={`fixed top-[60px] h-screen md:h-[calc(100vh-65px)] bottom-0 left-0 z-40 p-4 overflow-y-auto transition-transform duration-200 ${isShow ? 'translate-x-0' : '-translate-x-full'} w-full md:w-[360px] dark:bg-bgPrimary bg-bgLightPrimary`}
				tabIndex={-1}
				aria-labelledby="drawer-navigation-label"
			>
				<h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
					{t('sidebar.menu')}
				</h5>
				<div className="py-4 overflow-y-auto">
					<ul className="space-y-2 font-medium">
						{tabs.map((tab, index) => (
							<NavLink
								key={index}
								to={currentAppId ? `/developers/applications/${currentAppId}/${tab.routerLink}` : tab.routerLink}
								className={({ isActive }) =>
									isActive
										? 'sidebar-tab flex gap-1 items-center py-2 px-4 dark:bg-[#3C4370] bg-bgLightModeButton text-[#5865F3] dark:text-[#C9CDFB] rounded-[4px]'
										: 'sidebar-tab flex gap-1 items-center py-2 px-4 dark:text-textDarkTheme text-textLightTheme hover:dark:bg-[#3C4370] hover:bg-bgLightModeButton hover:text-[#5865F3] rounded-md'
								}
								onClick={toggleSideBar}
							>
								{tab.imgSrc && <img src={tab.imgSrc} alt="img" width={20} height={20} />}
								<p className="font-medium text-base leading-5">{tab.name}</p>
							</NavLink>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default CollapseSideBar;
