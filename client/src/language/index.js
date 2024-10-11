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
					username: 'Username',
					password: 'Password',
					welcomeBack: 'Welcome back!',
					login: 'Login',
					createNewAccount: 'Create a new ccount',
					continue: 'Continue',
					authError: 'Error during authentication',
					goBack: 'Go back',
					boxesLoading: 'Loading boxes...',
					home: 'Home',
					loggedInAs: 'Logged in as',
					logout: 'Logout',
					boxes: 'Boxes',
					yes: 'Yes',
					no: 'No',
					elementsPerPage: 'Elements per page',
					noscans: 'No scans',
					inprogress: 'In progress',
					reachedgps: 'Reached GPS',
					received: 'Received',
					validated: 'Validated',
					in: 'in',
					km: 'km',
					away: 'away',
				},
			},
		},
	});

export default i18n;
