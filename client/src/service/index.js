import i18n from '../language';

import Home from '../pages/Home';
import Login from '../pages/Login'
import Boxes from '../pages/Boxes';
import Scans from '../pages/Scans';
import Import from '../pages/Import';
import Export from '../pages/Export';
import Advanced from '../pages/Advanced';

import { IoHome, IoClose, IoCheckmark, IoPrint } from 'react-icons/io5';
import { FaBoxOpen, FaChevronUp, FaChevronDown, FaMapPin, FaEye, FaClock, FaQrcode, FaPlus } from 'react-icons/fa';
import { IoMdExit, IoMdRefresh, IoMdSettings } from 'react-icons/io';
import { BiImport, BiExport } from "react-icons/bi";
import { MdDelete } from 'react-icons/md';
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
	import: BiImport,
	export: BiExport,
	plus: FaPlus,
	refresh: IoMdRefresh,
	delete: MdDelete,
	print: IoPrint,
	settings: IoMdSettings,
}

export const getRoutes = () => [
	{
		path: '/auth',
		component: Login,
		public: true,
	},
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
		path: '/import',
		component: Import,
		title: i18n.t('import'),
		inNav: true,
		icon: icons.import,
		worksWithoutBoxes: true,
	},
	{
		path: '/export',
		component: Export,
		title: i18n.t('export'),
		inNav: true,
		icon: icons.export,
	},
	{
		path: '/advanced',
		component: Advanced,
		title: i18n.t('advanced'),
		inNav: true,
		icon: icons.settings,
	},
];

export const boxFields = [
	'project',
	'division',
	'district',
	'zone',
	'school',
	'htName',
	'htPhone',
	'schoolCode',
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
