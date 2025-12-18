import { memo, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	required?: boolean;
}

const Input = memo(({ label, error, id, className = '', required, ...props }: InputProps) => {
	return (
		<div className="space-y-2 p-1">
			{label && (
				<label htmlFor={id} className="block text-sm font-medium">
					{label}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}
			<input
				id={id}
				className={`w-full px-3 py-2 border rounded-md ${
					error ? 'border-red-500' : 'border-gray-300'
				} focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
				{...props}
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
});

export default Input;
