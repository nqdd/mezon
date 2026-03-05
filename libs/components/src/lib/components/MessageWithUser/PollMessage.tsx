import { getSrcEmoji } from '@mezon/utils';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PollDetailModal } from './PollDetailModal';

export type PollVoter = {
	displayName: string;
	username: string;
	avatar?: string;
};

export type PollMessageProps = {
	question: string;
	questionEmojiId?: string;
	answers: string[];
	answerEmojiIds?: string[];
	duration: string;
	allowMultipleAnswers: boolean;
	messageId?: string;
	votersByOption?: PollVoter[][];
};

export const PollMessage = ({
	question,
	questionEmojiId,
	answers,
	answerEmojiIds,
	duration,
	allowMultipleAnswers,
	votersByOption
}: PollMessageProps) => {
	const { t } = useTranslation('message');
	const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
	const [hasVoted, setHasVoted] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [votedAnswers, setVotedAnswers] = useState<number[]>([]);
	const [voteCounts, setVoteCounts] = useState<number[]>(new Array(answers.length).fill(0));
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [detailModalSelectedIndex, setDetailModalSelectedIndex] = useState(0);
	const canSelectAnswers = !hasVoted && !showResults;
	const shouldShowResults = hasVoted || showResults;

	const totalVotes = useMemo(() => voteCounts.reduce((sum, count) => sum + count, 0), [voteCounts]);

	const handleAnswerToggle = (index: number) => {
		if (!canSelectAnswers) return;

		if (allowMultipleAnswers) {
			setSelectedAnswers((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
		} else {
			setSelectedAnswers((prev) => (prev.length === 1 && prev[0] === index ? [] : [index]));
		}
	};

	const handleVote = () => {
		if (selectedAnswers.length === 0) return;
		// TODO: Send vote to backend
		const newVoteCounts = [...voteCounts];
		selectedAnswers.forEach((index) => {
			newVoteCounts[index] += 1;
		});
		setVoteCounts(newVoteCounts);
		setVotedAnswers(selectedAnswers);
		setShowResults(false);
		setHasVoted(true);
	};

	const handleRemoveVote = () => {
		const newVoteCounts = [...voteCounts];
		votedAnswers.forEach((index) => {
			newVoteCounts[index] = Math.max(0, newVoteCounts[index] - 1);
		});
		setVoteCounts(newVoteCounts);
		setVotedAnswers([]);
		setSelectedAnswers([]);
		setHasVoted(false);
		setShowResults(false);
	};

	const getPercentage = (count: number) => {
		if (totalVotes === 0) return 0;
		return Math.round((count / totalVotes) * 100);
	};

	const openDetailModal = (optionIndex: number) => {
		setDetailModalSelectedIndex(optionIndex);
		setIsDetailModalOpen(true);
	};

	return (
		<div className="block w-full">
			<style>{`
				@keyframes poll-bar-fill {
					from { transform: scaleX(0); opacity: 0.6; }
					to { transform: scaleX(1); opacity: 1; }
				}
				@keyframes poll-percent-pop {
					from { opacity: 0; transform: scale(0.9); }
					to { opacity: 1; transform: scale(1); }
				}
				.poll-bar-inner {
					transform-origin: left;
					animation: poll-bar-fill 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}
				.poll-percent-text {
					opacity: 0;
					animation: poll-percent-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}
			`}</style>
			<div className="max-w-[420px] rounded bg-item-theme p-3 border-theme-primary">
				{/* Question */}
				<div className="flex items-center gap-2 mb-1">
					{questionEmojiId && (
						<img
							src={getSrcEmoji(questionEmojiId)}
							alt={t('poll.selectedEmoji')}
							className="w-5 h-5 object-contain flex-shrink-0 mt-0.5"
						/>
					)}
					<h3 className="text-[15px] font-semibold text-theme-primary break-all flex-1 min-w-0">{question}</h3>
				</div>

				{/* Subtitle */}
				<p className="text-xs text-theme-primary mb-3">{allowMultipleAnswers ? t('poll.selectOneOrMore') : t('poll.selectOne')}</p>

				{/* Answers */}
				<div className="space-y-2 mb-3">
					{answers.map((answer, index) => {
						const voteCount = voteCounts[index];
						const percentage = getPercentage(voteCount);
						const isVoted = votedAnswers.includes(index);
						const answerEmoji = answerEmojiIds?.[index];

						return (
							<div
								key={index}
								onClick={shouldShowResults ? undefined : () => handleAnswerToggle(index)}
								className={`relative flex items-center justify-between px-3 py-2.5 rounded border overflow-hidden transition-colors ${
									shouldShowResults
										? 'border-theme-primary cursor-default pointer-events-none'
										: selectedAnswers.includes(index)
											? '[background:var(--bg-item-hover)] border-[var(--text-theme-primary)] hover:[background:var(--bg-active-member-channel)] hover:brightness-105 cursor-pointer'
											: '[background:var(--bg-item-hover)] border-transparent cursor-pointer'
								}`}
							>
								{shouldShowResults && (
									<div className="absolute inset-y-0 left-0 rounded-l min-w-0 overflow-hidden" style={{ width: `${percentage}%` }}>
										<div
											className="poll-bar-inner absolute inset-0 origin-left scale-x-0 rounded-l bg-blue-700/80"
											style={{ animationDelay: `${index * 0.2}s` }}
										/>
									</div>
								)}
								<div className="relative z-10 flex items-center gap-2 min-w-0 flex-1">
									{answerEmoji && (
										<img
											src={getSrcEmoji(answerEmoji)}
											alt={t('poll.selectedEmoji')}
											className="w-5 h-5 object-contain flex-shrink-0 mt-0.5"
										/>
									)}
									<span
										className={`text-sm font-medium ${hasVoted && isVoted ? 'text-theme-primary' : 'text-theme-primary-active'} break-all min-w-0 flex-1 truncate`}
									>
										{answer}
									</span>
								</div>
								<div className="relative z-10 flex items-center gap-3 flex-shrink-0 pl-2">
									{shouldShowResults && (
										<span
											className={`poll-percent-text text-xs font-semibold ${isVoted ? 'text-theme-primary' : 'text-theme-primary-active'}`}
											style={{ animationDelay: `${index * 0.1 + 0.25}s` }}
										>
											{percentage}% {voteCount} {voteCount < 2 ? t('poll.vote') : t('poll.votes')}
										</span>
									)}
									{canSelectAnswers && (
										<div
											className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 border-[var(--text-theme-primary)]`}
										>
											{selectedAnswers.includes(index) && <div className="w-2.5 h-2.5 rounded-full bg-theme-primary" />}
										</div>
									)}
									{hasVoted && isVoted && (
										<div className="w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center flex-shrink-0">
											<svg className="w-3 h-3 text-theme-primary" viewBox="0 0 12 12" fill="none">
												<path
													d="M2 6L5 9L10 3"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between pt-1">
					<span
						role="button"
						tabIndex={0}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							openDetailModal(0);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								openDetailModal(0);
							}
						}}
						className="text-xs text-theme-primary cursor-pointer hover:underline"
					>
						{totalVotes} {totalVotes < 2 ? t('poll.vote') : t('poll.votes')} • {duration} {t('poll.left')}
					</span>
					<div className="flex gap-2">
						{!hasVoted && (
							<button
								onClick={() => setShowResults((prev) => !prev)}
								className="px-1 py-1.5 text-sm font-medium border-theme-primary text-theme-primary hover:text-theme-primary-active rounded transition-colors"
							>
								{showResults ? t('poll.backToVote') : t('poll.showResults')}
							</button>
						)}
						{!hasVoted && !showResults && (
							<button
								onClick={handleVote}
								disabled={selectedAnswers.length === 0}
								className="px-4 py-1.5 text-sm font-medium rounded transition-colors btn-primary btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{t('poll.voteButton')}
							</button>
						)}
						{hasVoted && (
							<button
								onClick={handleRemoveVote}
								className="px-4 py-1.5 text-sm font-medium text-theme-primary rounded transition-colors border-theme-primary bg-button-secondary bg-secondary-button-hover"
							>
								{t('poll.removeVote')}
							</button>
						)}
					</div>
				</div>
			</div>

			<PollDetailModal
				open={isDetailModalOpen}
				onClose={() => setIsDetailModalOpen(false)}
				question={question}
				answers={answers}
				answerEmojiIds={answerEmojiIds}
				voteCounts={voteCounts}
				totalVotes={totalVotes}
				votersByOption={votersByOption}
				initialSelectedIndex={detailModalSelectedIndex}
				votedAnswers={votedAnswers}
			/>
		</div>
	);
};
