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
					noScans: 'No scans',
					inProgress: 'In progress',
					reachedGps: 'Reached GPS',
					received: 'Received',
					validated: 'Validated',
					currently: 'Currently',
					reachedOrReceived: 'Reached or received',
					in: 'in',
					km: 'km',
					away: 'away',
					secondsAgo_one: '{{count}} second ago',
					secondsAgo_other: '{{count}} seconds ago',
					minutesAgo_one: '{{count}} minute ago',
					minutesAgo_other: '{{count}} minutes ago',
					hoursAgo_one: '{{count}} hour ago',
					hoursAgo_other: '{{count}} hours ago',
					daysAgo_one: '{{count}} day ago',
					daysAgo_other: '{{count}} days ago',
					weeksAgo_one: '{{count}} week ago',
					weeksAgo_other: '{{count}} weeks ago',
					monthsAgo_one: '{{count}} month ago',
					monthsAgo_other: '{{count}} months ago',
					yearsAgo_one: '{{count}} year ago',
					yearsAgo_other: '{{count}} years ago',
					recipient: 'Recipient',
					project: 'Project',
					division: 'Division',
					district: 'District',
					zone: 'Zone',
					school: 'School',
					htName: 'HT Name',
					htPhone: 'HT Phone',
					createdAt: 'Created At',
					institutionType: 'Institution Type',
				},
			},
		},
	});

export default i18n;
