import { saveAs } from 'file-saver';
import { json2csv } from 'json-2-csv';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Icon,
	HStack,
	Text,
	Stack,
} from "@chakra-ui/react";
import { icons } from "../../../service";
import { useTranslation } from "react-i18next";
import { getLastFinalScan, getLastMarkedAsReceivedScan } from "../../../service/stats";
import { haversineDistance } from "../../../service/utils";
import { essentialFields } from '../../../service/specific';

function downloadJson(data, filename) {
	const blob = new Blob([ JSON.stringify(data) ], { type: 'application/json' });
	saveAs(blob, filename + '.json');
}

function downloadCSV(data, filename) {
	const csv = json2csv(data, {});
	const blob = new Blob([ csv ], { type: 'text/csv' });
	saveAs(blob, filename + '.csv');
}

export default function Report({ boxes }) {
	const { t } = useTranslation();

	const toExport = boxes.map(box => {
		const lastReachedScan = getLastFinalScan(box);
		const lastMarkedAsReceivedScan = getLastMarkedAsReceivedScan(box);
		const lastScan = box.scans ? box.scans[box.scans.length - 1] : null;

		const schoolCoords = {
			latitude: box.schoolLatitude,
			longitude: box.schoolLongitude,
			accuracy: 1
		};

		// const reachedCoords = lastReachedScan ? {
		// 	latitude: lastReachedScan?.location?.coords.latitude,
		// 	longitude: lastReachedScan?.location?.coords.longitude,
		// 	accuracy: lastReachedScan?.location?.coords.accuracy
		// } : null;

		const receivedCoords = lastMarkedAsReceivedScan ? {
			latitude: lastMarkedAsReceivedScan?.location?.coords.latitude,
			longitude: lastMarkedAsReceivedScan?.location?.coords.longitude,
			accuracy: lastMarkedAsReceivedScan?.location?.coords.accuracy
		} : null;

		// const reachedDistanceInMeters = reachedCoords ? Math.round(haversineDistance(schoolCoords, reachedCoords)) : '';
		const receivedDistanceInMeters = receivedCoords ? Math.round(haversineDistance(schoolCoords, receivedCoords)) : '';
		const lastScanDistanceInMeters = lastScan ? Math.round(haversineDistance(schoolCoords, lastScan.location.coords)) : '';

		const result = {
			id: box.id,
		};

		essentialFields.forEach(field => {
			if (box[field]) {
				result[field] = box[field];
			}
		});

		return {
			...result,
			schoolLatitude: box.schoolLatitude,
			schoolLongitude: box.schoolLongitude,
			lastScanLatitude: lastScan?.location?.coords.latitude || '',
			lastScanLongitude: lastScan?.location?.coords.longitude || '',
			lastScanDistanceInMeters,
			lastScanDate: lastScan ? new Date(lastScan?.location.timestamp).toLocaleDateString() : '',
			reachedGps: !!lastReachedScan,
			received: !!lastMarkedAsReceivedScan,
			receivedDistanceInMeters,
			receivedDate: lastMarkedAsReceivedScan ? new Date(lastMarkedAsReceivedScan?.location.timestamp).toLocaleDateString() : '',
		}
	});

	const title = `${t('currentDeliveryReport')} - ${new Date().toISOString().slice(0, 10)}`;

	return (
		<Menu>
			<MenuButton
				as={Button}
				variant='outline'
				size='lg'
				paddingY={10}
			>
				<HStack
					width='100%'
					gap={5}
				>
					<Icon
						as={icons.clock}
						boxSize={5}
					/>
					<Stack
						flexDirection='column'
						alignItems='start'
					>
						<Text>{t('currentDeliveryReport')}</Text>
						<Text fontWeight='light' whiteSpace='normal'>{t('currentDeliveryReportDetail')}</Text>
					</Stack>
				</HStack>
			</MenuButton>
			<MenuList>
				<MenuItem
					onClick={() => downloadCSV(toExport, title)}
				>
					CSV
				</MenuItem>
				<MenuItem
					onClick={() => downloadJson(toExport, title)}
				>
					JSON
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
