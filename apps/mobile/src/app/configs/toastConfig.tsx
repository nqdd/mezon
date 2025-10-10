import { ToastConfig } from 'react-native-toast-message';
import { ToastError } from './component/ToastError';
import { ToastNotification } from './component/ToastNotification';
import { ToastSuccess } from './component/ToastSuccess';

export const toastConfig: ToastConfig = {
	/*
		Custom toast:
		They will be passed when calling the `show` method
	*/

	success: (props) => {
		return <ToastSuccess {...props} />;
	},

	error: (props) => {
		return <ToastError {...props} />;
	},

	notification: (props) => {
		return <ToastNotification {...props} />;
	}
};
