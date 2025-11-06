export const LIMIT_WALLET = 8;

export type FilterType = 'all' | 'sent' | 'received';

export const TRANSACTION_FILTERS = {
	ALL: 'all',
	SENT: 'sent',
	RECEIVED: 'received'
} as const;

export const API_FILTER_PARAMS = {
	[TRANSACTION_FILTERS.ALL]: undefined,
	[TRANSACTION_FILTERS.SENT]: 2,
	[TRANSACTION_FILTERS.RECEIVED]: 1
};

export const I18N_KEYS = {
	FILTERS: {
		ALL: 'filters.all',
		SENT: 'filters.sent',
		RECEIVED: 'filters.received'
	},
	TRANSACTION_TYPES: {
		SENT: 'transactionTypes.sent',
		RECEIVED: 'transactionTypes.received'
	},
	CURRENCY: {
		CODE: 'currency.code',
		SYMBOL: 'currency.symbol'
	},
	HEADER: {
		TITLE: 'header.title',
		SUBTITLE: 'header.subtitle'
	},
	FOOTERS: {
		NOTI: 'footers.noti',
		FETCHING: 'footers.fetching'
	},
	EMPTY_STATES: {
		NO_TRANSACTIONS: {
			TITLE: 'emptyStates.noTransactions.title',
			DESCRIPTION: 'emptyStates.noTransactions.description'
		},
		NO_FILTERED_TRANSACTIONS: {
			TITLE: 'emptyStates.noFilteredTransactions.title',
			DESCRIPTION: 'emptyStates.noFilteredTransactions.description'
		}
	},
	TRANSACTION_DETAIL: {
		FIELDS: {
			TRANSACTION_ID: 'transactionDetail.fields.transactionId',
			SENDER: 'transactionDetail.fields.sender',
			AMOUNT: 'transactionDetail.fields.amount',
			RECEIVER: 'transactionDetail.fields.receiver',
			NOTE: 'transactionDetail.fields.note',
			CREATED: 'transactionDetail.fields.created'
		},
		DEFAULT_NOTE: 'transactionDetail.defaultNote',
		UNKNOWN_USER: 'transactionDetail.unknownUser'
	},
	TRANSACTION_ITEM: {
		ID_PREFIX: 'transactionItem.idPrefix'
	}
};

export const TAB_LABELS = I18N_KEYS.FILTERS;
export const TRANSACTION_TYPES = I18N_KEYS.TRANSACTION_TYPES;
export const CURRENCY = I18N_KEYS.CURRENCY;
export const EMPTY_STATES = I18N_KEYS.EMPTY_STATES;
export const HEADER = I18N_KEYS.HEADER;
export const FOOTERS = I18N_KEYS.FOOTERS;

// Non-translatable constants
export const TRANSACTION_DETAIL = {
	FIELDS: I18N_KEYS.TRANSACTION_DETAIL.FIELDS,
	DEFAULT_NOTE: I18N_KEYS.TRANSACTION_DETAIL.DEFAULT_NOTE,
	UNKNOWN_USER: I18N_KEYS.TRANSACTION_DETAIL.UNKNOWN_USER,
	COPY_DURATION: 1500
};

export const TRANSACTION_ITEM = {
	ID_PREFIX: I18N_KEYS.TRANSACTION_ITEM.ID_PREFIX,
	ID_LENGTH: 8,
	SKELETON_COUNT: 6
};

export const DATE_FORMAT = {
	DAY: '2-digit',
	MONTH: '2-digit',
	YEAR: 'numeric',
	HOURS: '2-digit',
	MINUTES: '2-digit',
	SEPARATOR: '/',
	TIME_SEPARATOR: ' '
};
