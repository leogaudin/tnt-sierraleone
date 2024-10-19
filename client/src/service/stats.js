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

// export function getLastInProgressScan(box) {
// 	const scans = box.scans;
// 	if (!scans || !scans.length) return null;
// 	const inProgressScans = scans.filter(scan => !scan.finalDestination && !scan.markedAsReceived);
// 	if (!inProgressScans.length) return null;
// 	return inProgressScans.reduce((acc, scan) => {
// 		return acc.time > scan.time ? acc : scan;
// 	});
// }

export function getProgress(box) {
	if (!box?.scans || box?.scans?.length === 0) {
		return 'noScans';
	}

	const lastValidatedScan = getLastValidatedScan(box);
	const lastFinalScan = getLastFinalScan(box);
	const lastReceivedScan = getLastMarkedAsReceivedScan(box);

	if (lastValidatedScan) {
		return 'validated';
	}

	if (lastFinalScan || lastReceivedScan) {
		return 'reachedOrReceived';
	}

	return 'inProgress';
}

export function getStatusPercentage(sample, status = 'validated') {
	const boxes = sample.map(box => { return { ...box, progress: getProgress(box) } });

	const deliveredBoxes = boxes.filter(box => box.progress === status).length;

	return (deliveredBoxes / sample.length) * 100;
}

export const sampleToRepartition = (sample) => {
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
