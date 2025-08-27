import { Icons, Image } from '@mezon/ui';
import { useCallback, useState } from 'react';

interface IFirstJoinPopup {
	onclose: () => void;
	openCreateClanModal: () => void;
}

const FirstJoinPopup = ({ onclose, openCreateClanModal }: IFirstJoinPopup) => {
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState(false);
	const handleJoinClan = () => {
		//mezon.ai
		const url = `${process.env.NX_DOMAIN_URL}/invite/`;
		const lengthInviteCode = 19;
		if (inputValue.startsWith(url) && inputValue.length === url.length + lengthInviteCode) {
			const idInvite = inputValue.split('/').pop();
			if (idInvite && idInvite.length === lengthInviteCode && idInvite.match('\\d+')) {
				window.open(inputValue, '_blank');
			}
		} else {
			setError(true);
		}
	};
	const handleSetInputValue = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (error) {
				setError(false);
			}
			setInputValue(e.target.value);
		},
		[error]
	);
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-[#000000c9]">
			<div className="relative z-10 w-[680px] flex max-sm:justify-center">
				<Image src={`assets/images/first-join-bg.svg`} width={240} className="object-cover rounded-l-md max-sm:hidden" />
				<div className="text-[#4e5058] bg-white rounded-r-md max-sm:rounded-md relative flex flex-col">
					<Icons.MenuClose onClick={onclose} className="absolute top-5 right-5 w-[16px] cursor-pointer" />
					<div className="px-[16px] flex flex-col h-full flex-1 gap-4 pt-20">
						<div className="text-center">
							<div className="text-black text-[13px]">If you have invitation link,</div>
							<div className="text-black font-bold text-[25px]">Join clan</div>
							<div>Enter the invitation link below to join an available clan</div>
						</div>
						<div className="flex flex-col gap-[5px]">
							<div className=" text-xs font-bold flex flex-1 items-center justify-between">
								<p className="uppercase">Invitation link</p>
								{error && (
									<p className="text-[10px]  font-semibold italic text-red-500">The invitation is not valid or has expired</p>
								)}
							</div>
							<input
								value={inputValue}
								onChange={handleSetInputValue}
								type="text"
								className="bg-[#dfe0e2] outline-primary border border-white hover:border-[#979a9e] w-full rounded-md p-[10px] text-[15px]"
							/>
							<div className="text-xs flex flex-col gap-2">Example: https://mezon.ai/invite/:id, hTKzmak</div>
						</div>
					</div>
					<div className="p-[16px] flex justify-between">
						<div className="flex items-center gap-1	">
							<div>
								Or{' '}
								<span
									onClick={() => {
										openCreateClanModal();
										onclose();
									}}
									className="font-semibold hover:underline cursor-pointer"
								>
									Create your own clan
								</span>
							</div>
						</div>
						<button
							onClick={handleJoinClan}
							className={`${inputValue === '' ? 'bg-[#959cf1]' : 'bg-[#5865f2] hover:bg-[#444ec1]'} text-white px-[13px] py-[5px] rounded-sm select-none`}
							disabled={inputValue === '' ? true : false}
						>
							Join clan
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FirstJoinPopup;
