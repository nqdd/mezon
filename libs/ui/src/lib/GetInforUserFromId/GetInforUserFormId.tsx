import { selectMemberClanByUserId, useAppSelector } from '@mezon/store';

type Props = {
	readonly id: string;
	url?: string;
	name?: string;
};

export function NameComponent({ id, name }: Props) {
	const user = useAppSelector((state) => selectMemberClanByUserId(state, id));
	return <p className="text-sm font-medium text-theme-primary">{name ? name : user?.user?.username}</p>;
}
