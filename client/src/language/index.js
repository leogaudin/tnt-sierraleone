import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const languages = [
	{ label: 'English', code: 'en' },
];

i18n
	.use(initReactI18next)
	.init({
		lng: 'en',
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: {
				translation: {
					'username': 'Username',
					'password': 'Password',
					'welcomeBack': 'Welcome back!',
					'login': 'Login',
					'createNewAccount': 'Create a new account',
					'continue': 'Continue',
					'authError': 'Error during authentication',
					'goBack': 'Go back',
				},
			},
		},
	});

export default i18n;
