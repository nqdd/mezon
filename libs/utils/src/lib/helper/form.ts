export const validateEmail = (value: string) => {
	if (!value) {
		return 'Email is required';
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		return 'Please enter a valid email address';
	}

	return '';
};

export const validatePassword = (value: string) => {
	if (value.length < 8) {
		return 'characters';
	}
	if (!/[A-Z]/.test(value)) {
		return 'uppercase';
	}
	if (!/[a-z]/.test(value)) {
		return 'lowercase';
	}
	if (!/[0-9]/.test(value)) {
		return 'number';
	}
	if (!/[^A-Za-z0-9]/.test(value)) {
		return 'symbol';
	}
	return '';
};
