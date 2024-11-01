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

/**
 * Adds to each box an object of statuses as
 * {
 * 	inProgress: Date,
 * 	reachedGps: Date,
 * 	reachedAndReceived: Date,
 * 	received: Date,
 * 	validated: Date
 * }
 * For each status, determine when it was reached for the first time
 * @param {Array} sample
 */
export function indexStatusChanges(sample) {
	sample.forEach(box => {
		const scans = box.scans;
		scans.sort((a, b) => a.time - b.time); // First scan is the oldest

		const statusChanges = {
			inProgress: null,
			reachedGps: null,
			reachedAndReceived: null,
			received: null,
			validated: null
		};

		for (const scan of scans) {
			if (scan.finalDestination && scan.markedAsReceived) {
				statusChanges.validated ??= scan.time;
				break;
			}

			if (scan.finalDestination) {
				if (statusChanges.received) {
					statusChanges.reachedAndReceived ??= scan.time;
				} else {
					statusChanges.reachedGps ??= scan.time;
				}
				continue;
			}

			if (scan.markedAsReceived) {
				if (statusChanges.reachedGps) {
					statusChanges.reachedAndReceived ??= scan.time;
				} else {
					statusChanges.received ??= scan.time;
				}
				continue;
			}

			if (Object.values(statusChanges).every(status => !status)) {
				statusChanges.inProgress = scan.time;
			}
		}

		box.statusChanges = statusChanges;
	});
}
