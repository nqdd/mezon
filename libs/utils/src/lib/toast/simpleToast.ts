let toastContainer: HTMLElement | null = null;

const createToastContainer = (): HTMLElement => {
	if (toastContainer) {
		return toastContainer;
	}

	toastContainer = document.createElement('div');
	toastContainer.id = 'simple-toast-container';
	toastContainer.style.cssText = `
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		pointer-events: none;
	`;
	document.body.appendChild(toastContainer);
	return toastContainer;
};

const createToastElement = (message: string): HTMLElement => {
	const toast = document.createElement('div');
	toast.className = 'simple-toast';
	toast.textContent = message;
	toast.style.cssText = `
		background-color: rgba(33, 33, 33, 0.9);
		color: white;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 14px;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	`;
	return toast;
};

export const showSimpleToast = (message: string, duration = 2000): void => {
	const container = createToastContainer();
	const toast = createToastElement(message);

	container.appendChild(toast);

	requestAnimationFrame(() => {
		toast.style.opacity = '1';
	});

	setTimeout(() => {
		toast.style.opacity = '0';

		setTimeout(() => {
			if (container.contains(toast)) {
				container.removeChild(toast);
			}
		}, 300);
	}, duration);
};
