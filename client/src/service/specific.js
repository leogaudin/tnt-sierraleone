// Here are all the country-specific configurations, to facilitate the process of adapting the application to a new country.

// TnT + name of the country + flag
export const name = 'TnT Sierra Leone 🇸🇱';

export const colors = {
	lightest: '#e5f0f9',
	light: '#b2d4ed',
	main: '#0072c6',
	dark: '#004f8a',
	darkest: '#00223b',
};

// The corresponding API URL
export const API_URL =
	process.env.NODE_ENV === 'development'
		?
		'http://localhost:3000/api'
		:
		'https://tnt-sierraleone-api.vercel.app/api'


// Fields that should be: displayed as information, or the full representation of the object
// Used in:
// - PDFExport.jsx
// - UploadBoxes.jsx
// - csv.js
// MUST MATCH boxFields VARIABLE IN server/models/boxes.model.js
export const boxFields = {
	project: { type: String, required: true },
	province: { type: String, required: true },
	district: { type: String, required: false },
	council: { type: String, required: false },
	chiefdom: { type: String, required: false },
	school: { type: String, required: true },
	schoolCode: { type: String, required: true },
	htName: { type: String, required: false },
	htPhone: { type: String, required: false },
};

// Fields that characterize a school in the GPS update list
// Used in:
// - UpdateGPS.jsx
// - csv.js
export const gpsUpdateFields = [
	'schoolCode',
]

// Fields that characterize a school in the Delivery report
// Used in:
// - Report.jsx
export const reportFields = [
	'school',
	'province',
]

// Keys that should not be available to the user (e.g. when filtering)
// Used in:
// - BoxFiltering.jsx
// - BoxModal.jsx
export const excludedKeys = [
	'_id',
	'__v',
	'id',
	'adminId',
	'scans',
	'schoolLatitude',
	'schoolLongitude',
	'statusChanges',
	'progress',
	'content',
	'lastScan',
];
