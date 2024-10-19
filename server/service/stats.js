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

export function sampleToRepartition(sample) {
	const data = {
		noScans: 0,
		inProgress: 0,
		reachedOrReceived: 0,
		validated: 0,
	}

	data.total = sample.length;

	sample.forEach(box => {
		if (!box.scans || box.scans.length === 0) {
			data.noScans++;
		} else {
			const progress = getProgress(box);
			data[progress]++;
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
	return sample.map(box => {
		const scans = box.scans.filter(scan => scan.location.timestamp <= date);
		return {
			...box,
			scans
		};
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
    const timestamps = getAllTimestamps(sample);
    const data = [];

    if (timestamps.length === 0) return data;

    const initial = timestamps[0];
    const maxTimestamp = timestamps[timestamps.length - 1] + 86400000;
    let repartition;
    let index = 0;

    for (let i = initial; i <= maxTimestamp; i += 86400000) {
        while (index < timestamps.length && timestamps[index] < i) {
            index++;
        }
        if (index < timestamps.length && isSameDay(i, timestamps[index])) {
            const boxesAtDate = getSampleAtDate(sample, i);
            repartition = sampleToRepartition(boxesAtDate);
            index++;
        }

        data.push({
            name: getDateString(i),
            ...repartition
        });
    }

    return data;
}
