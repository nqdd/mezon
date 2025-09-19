import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import * as languages from './languages';

const ns = Object.keys(Object.values(languages)[0]);
export const defaultNS = ns[0];

const resources = Object.entries(languages).reduce(
	(acc, [key, value]) => ({
		...acc,
		[key]: value
	}),
	{}
);

const timezoneDetector = {
	name: 'timezone',
	lookup() {
		const storedLang = localStorage.getItem('i18nextLng');

		if (storedLang && (storedLang === 'vi' || storedLang === 'en')) {
			return undefined;
		}

		const browserLanguage = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage;

		if (browserLanguage) {
			const languageCode = browserLanguage.toLowerCase();
			if (languageCode.startsWith('vi')) {
				return 'vi';
			}
			if (languageCode.startsWith('en')) {
				return 'en';
			}
		}

		return undefined;
	},
	cacheUserLanguage(lng: string) {
		if (lng && (lng === 'vi' || lng === 'en')) {
			localStorage.setItem('i18nextLng', lng);
		}
	}
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(timezoneDetector);

i18n.use(Backend)
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		ns,
		defaultNS,
		resources: {
			...Object.entries(resources).reduce(
				(acc, [key, value]) => ({
					...acc,
					[key]: value
				}),
				{}
			)
		},
		fallbackLng: 'en',
		supportedLngs: ['en', 'vi'],
		detection: {
			order: ['timezone', 'localStorage', 'navigator', 'htmlTag'],
			lookupLocalStorage: 'i18nextLng',
			caches: ['localStorage']
		},
		debug: true,
		interpolation: {
			escapeValue: false
		},
		compatibilityJSON: 'v3'
	});

export default i18n;
