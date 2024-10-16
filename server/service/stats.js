export function getLastFinalScan(box) {
	const scans = box.scans;
	if (!scans || !scans.length) return null;
	const finalScans = scans.filter(scan => scan.finalDestination);
	if (!finalScans.length) return null;
	return finalScans.reduce((acc, scan) => {
		return acc.time > scan.time ? acc : scan;
	});
}

export function getLastMarkedAsReceivedScan(box) {
	const scans = box.scans;
	if (!scans || !scans.length) return null;
	const markedAsReceivedScans = scans.filter(scan => scan.markedAsReceived);
	if (!markedAsReceivedScans.length) return null;
	return markedAsReceivedScans.reduce((acc, scan) => {
		return acc.time > scan.time ? acc : scan;
	});
}

export function sampleToRepartition(sample) {
	const data = {
		noScans: 0,
		inProgress: 0,
		reachedOrReceived: 0,
		validated: 0,
	}

	sample.forEach(box => {
		if (box?.scans?.length > 0) {
			const lastFinalScan = getLastFinalScan(box);
			const lastReceivedScan = getLastMarkedAsReceivedScan(box);
			if (lastFinalScan || lastReceivedScan) {
				if (lastFinalScan && lastReceivedScan) {
					data.validated++;
				} else {
					data.reachedOrReceived++;
				}
			} else {
				data.inProgress++;
			}
		} else {
			data.noScans++;
		}
	});

	return data;
}

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

export function sampleToTimeline(sample) {
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
