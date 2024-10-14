import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer
} from 'recharts';
import { palette } from '../../../theme';
import { sampleToRepartition } from '../../../service/stats';
import { useTranslation } from 'react-i18next';
import { Flex } from '@chakra-ui/react';

const getAllTimestamps = (sample) => {
	const timestamps = [];
	[...sample].forEach(box => {
		box.scans.forEach(scan => {
			timestamps.push(scan.location.timestamp);
		});
	});

	timestamps.sort((a, b) => a - b);

	return timestamps;
}

const getSampleAtDate = (sample, date) => {
	return JSON.parse(JSON.stringify(sample)).map(box => {
		box.scans = box.scans.filter(scan => scan.location.timestamp <= date);
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

const sampleToTimeline = (sample) => {
	const timestamps = [...getAllTimestamps(sample)];
	const data = [];

	const initial = timestamps[0];
	let repartition;

	for (let i = initial; i <= timestamps[timestamps.length - 1]; i += 86400000) {
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
	sample,
	height = 400,
}) {
	const { t } = useTranslation();

	if (!sample?.length || sample.flatMap(box => box.scans).length === 0)
		return null;

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
					border: '1px solid #ccc',
					margin: 0,
					padding: 10,
					borderRadius: 5
				}}
			>
				<h3>{`${label} (Total: ${total})`}</h3>
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
					// width={500}
					// height={400}
					data={sampleToTimeline(JSON.parse(JSON.stringify(sample)))}
				>
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip content={renderTooltipContent} />
					<Area type='monotone' dataKey='validated' stackId='1' stroke={palette.success.main} fill={palette.success.main} />
					<Area type='monotone' dataKey='reachedOrReceived' stackId='1' stroke={palette.warning.main} fill={palette.warning.main} />
					<Area type='monotone' dataKey='inProgress' stackId='1' stroke={palette.info.main} fill={palette.info.main} />
					<Area type='monotone' dataKey='noScans' stackId='1' stroke={palette.error.main} fill={palette.error.main} />
				</AreaChart>
			</ResponsiveContainer>
		</Flex>
	)
}
