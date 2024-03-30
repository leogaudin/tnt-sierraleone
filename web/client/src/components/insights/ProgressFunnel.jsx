import { ResponsiveFunnel } from '@nivo/funnel'
import InsightWrapper from '../reusable/InsightWrapper';
import { commonProperties } from './index';
import { useTranslation } from 'react-i18next';
import { createPalette } from '../../theme/create-palette';
import { getLastFinalScan, getLastMarkedAsReceivedScan } from '../../service';

export default function ProgressFunnel({sample}) {
	const {t} = useTranslation();
	const palette = createPalette();

	function getNivoFunnelData(sample) {
		const data = [
			{
				id: t('total'),
				value: 0,
				color: palette.primary.darkest
			},
			{
				id: t('scannedAtLeastOnce'),
				value: 0,
				color: palette.primary.dark
			},
			{
				id: t('deliveredOrReceived'),
				value: 0,
				color: palette.primary.main
			},
			{
				id: t('validated'),
				value: 0,
				color: palette.primary.light
			}
		];

		sample.forEach(box => {
			data[0].value++;
			if (box?.scans && box?.scans?.length > 0) {
				if (box?.scans?.length)
					data[1].value++;
				const lastFinalScan = getLastFinalScan(box);
				const lastReceivedScan = getLastMarkedAsReceivedScan(box);
				if (lastFinalScan || lastReceivedScan) {
					data[2].value++;
				}
				if (lastFinalScan && lastReceivedScan) {
					data[3].value++;
				}
			}
		});

		return data;
	}

	return (
		<InsightWrapper title={t('progressFunnel')} width={35}>
			<ResponsiveFunnel
				{...commonProperties}
				isInteractive={true}
				currentPartSizeExtension={5}
				currentBorderWidth={10}
				data={getNivoFunnelData(sample)}
				colors={{ 'datum': 'color' }}
				labelColor="#ffffff"
				shapeBlending={1}
				motionConfig="gentle"
				tooltip={({part}) =>
					<div style={{
						padding: 12,
						color: '#222222',
						background: '#fff'
					}}>
						<span>
							{part.data.id}: <strong>{part.formattedValue}</strong>
						</span>
					</div>
				}
			/>
		</InsightWrapper>
	);
}
