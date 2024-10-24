import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import { sampleToRepartition } from '../../../service/stats';
import { useTranslation } from 'react-i18next';
import { Flex } from '@chakra-ui/react';
import { progresses } from '../../../service';

const getAllTimestamps = (sample) => {
	const timestamps = [];
	[...sample].forEach(box => {
		box.scans.forEach(scan => {
			timestamps.push(scan.time);
		});
	});

	timestamps.sort((a, b) => a - b);

	return timestamps;
}

const getSampleAtDate = (sample, date) => {
	return JSON.parse(JSON.stringify(sample)).map(box => {
		box.scans = box.scans.filter(scan => scan.time <= date);
		return box;
	});
}

const getDateString = (date) => {
	const d = new Date(date);
	return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const isSameDay = (date1, date2) => {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	return d1.getDate() === d2.getDate()
		&& d1.getMonth() === d2.getMonth()
		&& d1.getFullYear() === d2.getFullYear();
}

function sampleToTimeline(sample) {
	const timestamps = [...getAllTimestamps(sample)];
	const data = [];

	const initial = timestamps[0];
	const maxTimestamp = timestamps[timestamps.length - 1]
	let repartition;

	for (let i = initial; i <= maxTimestamp; i += 86400000) {
		if (!timestamps.length) break;
		while (timestamps.length > 0 && timestamps[0] < i) {
			timestamps.shift();
		}
		if (timestamps.length > 0 && isSameDay(i, timestamps[0])) {
			timestamps.shift();
			const boxesAtDate = getSampleAtDate(sample, i);
			repartition = sampleToRepartition(boxesAtDate);
		}

		data.push({
			name: getDateString(i),
			...repartition
		});
	}

	return data;
}

const getPercent = (value, total) => {
	const ratio = total > 0 ? value / total : 0;
	return `${(ratio * 100).toFixed(1)}%`;
};

export default function Timeline({
	data,
	height = 400,
}) {
	const { t } = useTranslation();

	if (!data.length) return null;

	const renderTooltipContent = o => {
		const {
			payload,
			label
		} = o;
		const total = payload.reduce((result, entry) => result + entry.value, 0);
		return (
			<div
				style={{
					background: '#fff',
					border: '1.5px solid #ccc',
					margin: 0,
					padding: 10,
					borderRadius: 5
				}}
			>
				<h3>{`${label}`}</h3>
				<ul
					style={{
						listStyle: 'none'
					}}
				>
					{payload.map(entry => (
						<li key={`item-${entry.name}`} style={{
							color: entry.color
						}}>
							{`${t(entry.name)}: ${entry.value} (${getPercent(entry.value, total)})`}
						</li>
					))}
					<li style={{ fontWeight: 'light' }}>{`${t('total')}: ${total}`}</li>
				</ul>
			</div>
		);
	};

	return (
		<Flex
			height={height}
		>
			<ResponsiveContainer width='100%' height='100%'>
				<AreaChart
					data={data}
				>
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip content={renderTooltipContent} />
					{[...progresses].toReversed().map((progress, i) => {
						if (progress.inTimeline) {
							return (
								<Area
									key={i}
									type='monotone'
									dataKey={progress.key}
									stackId='1'
									stroke={progress.color}
									fill={progress.color}
								/>
							)
						}
					})}
				</AreaChart>
			</ResponsiveContainer>
		</Flex>
	)
}
