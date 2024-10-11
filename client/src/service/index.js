import i18n from '../language';

import Home from '../pages/Home';
import Login from '../pages/Login'
import Boxes from '../pages/Boxes';
import Scans from '../pages/Scans';

import { IoHome, IoClose, IoCheckmark } from 'react-icons/io5';
import { FaBoxOpen, FaChevronUp, FaChevronDown, FaMapPin, FaEye, FaClock, FaQrcode } from 'react-icons/fa';
import { IoMdExit } from 'react-icons/io';
import { palette } from '../theme';

export const API_URL =
						// process.env.NODE_ENV === 'development'
						// ? 'http://localhost:3000/api'
						// :
						'https://track-and-trace-api.vercel.app/api'

export const user = JSON.parse(localStorage.getItem('user'));

export const navbarWidth = '250px';

export const callAPI = async (method, endpoint, data = null, headers = {}) => {
	const authorization = user?.apiKey || null;
	const requestHeaders = {
		'Content-Type': 'application/json',
		'X-Authorization': authorization,
		...headers,
	};

	const response = await fetch(`${API_URL}/${endpoint}`, {
		method: method,
		headers: requestHeaders,
		body: data ? JSON.stringify(data) : null,
	});

	return response;
}

export const icons = {
	home: IoHome,
	box: FaBoxOpen,
	exit: IoMdExit,
	check: IoCheckmark,
	close: IoClose,
	up: FaChevronUp,
	down: FaChevronDown,
	pin: FaMapPin,
	eye: FaEye,
	clock: FaClock,
	qr: FaQrcode,
}

export const routes = [
	{
		path: '/',
		component: Home,
		title: i18n.t('home'),
		inNav: true,
		icon: icons.home,
	},
	{
		path: '/boxes',
		component: Boxes,
		title: i18n.t('boxes'),
		inNav: true,
		icon: icons.box,
	},
	{
		path: '/scans',
		component: Scans,
		title: i18n.t('scans'),
		inNav: true,
		icon: icons.qr,
	},
	{
		path: '/auth',
		component: Login,
		public: true,
	},
];

export const excludedKeys = [
	'_id',
	'__v',
	'id',
	'adminId',
	'scans',
	'schoolLatitude',
	'schoolLongitude',
];

export const progressColors = {
	noScans: palette.error.main,
	inProgress: palette.info.main,
	reachedGps: palette.warning.main,
	received: palette.warning.main,
	reachedOrReceived: palette.warning.main,
	validated: palette.success.main,
}
