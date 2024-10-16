import { Home as HomeIcon, Inventory as InventoryIcon, QrCodeScanner as QrCodeScannerIcon, IosShare as IosShareIcon, Delete as DeleteIcon } from '@mui/icons-material'
import i18n from './language';

export const boxFields = [
	'project',
	'province',
	'district',
	'council',
	'chiefdom',
	'school',
	'htName',
	'htPhone',
];

export function getItems() {
	return [
		{
			title: i18n.t('home'),
			path: '/',
			icon: <HomeIcon />
		},
		{
			title: i18n.t('boxes'),
			path: '/boxes',
			icon: <InventoryIcon />
		},
		{
			title: i18n.t('scans'),
			path: '/scans',
			icon: <QrCodeScannerIcon />
		},
		{
			title: i18n.t('export'),
			path: '/export',
			icon: <IosShareIcon />
		},
		{
			title: i18n.t('delete'),
			path: '/delete',
			icon: <DeleteIcon />
		},
	];
}

export function getTextsMap() {
	return {
		noscans: i18n.t('noscans'),
		inprogress: i18n.t('inprogress'),
		delivered: i18n.t('delivered'),
		received: i18n.t('received'),
		validated: i18n.t('validated'),
	};
}

export const colorsMap = {
	noscans: 'neutral',
	inprogress: 'info',
	validated: 'success',
	delivered: 'warning',
	received: 'warning',
};
