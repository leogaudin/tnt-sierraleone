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

export function getLastValidatedScan(box) {
	const scans = box.scans;
	if (!scans || !scans.length) return null;
	const validatedScans = scans.filter(scan => scan.finalDestination && scan.markedAsReceived);
	if (!validatedScans.length) return null;
	return validatedScans.reduce((acc, scan) => {
		return acc.time > scan.time ? acc : scan;
	});
}

export function getProgress(box) {
	if (!box?.scans || box?.scans?.length === 0) {
		return 'noScans';
	}

	const lastValidatedScan = getLastValidatedScan(box);
	if (lastValidatedScan) {
		return 'validated';
	}

	const lastFinalScan = getLastFinalScan(box);
	const lastReceivedScan = getLastMarkedAsReceivedScan(box);

	if (lastFinalScan && lastReceivedScan) {
		return 'reachedAndReceived';
	}

	if (lastFinalScan) {
		return 'reachedGps';
	}

	if (lastReceivedScan) {
		return 'received';
	}

	return 'inProgress';
}

export function getStatusPercentage(sample, status = 'validated') {
	const boxes = sample.map(box => { return { ...box, progress: getProgress(box) } });

	const deliveredBoxes = boxes.filter(box => box.progress === status).length;

	return (deliveredBoxes / sample.length) * 100;
}

export function sampleToRepartition(sample, notAfterTimestamp = Date.now()) {
	const repartition = {
		noScans: 0,
		inProgress: 0,
		reachedGps: 0,
		received: 0,
		reachedAndReceived: 0,
		validated: 0,
		total: sample.length,
	};

	for (const box of sample) {
		const changes = box.statusChanges;
		const statuses = Object.keys(changes).filter(status => changes[status] !== null);
		const lastStatus = statuses.reduce((acc, curr) => {
			if (changes[curr] >= (changes[acc] || 0) && changes[curr] <= notAfterTimestamp)
				return curr;

			return acc;
		}, 'noScans');

		repartition[lastStatus]++;
	}

	return repartition;
}

export function sampleToTimeline(sample) {
	const allTimestamps = sample
							.map(box => box.statusChanges)
							.map(statusChanges => Object.values(statusChanges).filter(timestamp => !!timestamp))
							.flat();

	const oneDay = 86400000;

	const final = Math.max(...allTimestamps) + oneDay;
	const initial = Math.max(
		Math.min(...allTimestamps),
		final - (365 * oneDay / 2)
	) - oneDay;

	const data = [];

	for (let i = initial; i <= final; i += oneDay) {
		const day = new Date(i).toISOString().split('T')[0];

		const repartition = sampleToRepartition(sample, i);

		data.push({
			name: day,
			...repartition,
		});
	}

	return data;
}

export function computeInsights(boxes, setInsights) {
	const projects = [...new Set(boxes.map(box => box.project))];

	const insights = {};

	for (const project of projects) {
		const sample = boxes.filter((box) => box.project === project);

		insights[project] = {
			timeline: sampleToTimeline(sample),
			repartition: sampleToRepartition(sample)
		};
	}

	setInsights(insights);
}
