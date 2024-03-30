import { getLastFinalScan, getLastMarkedAsReceivedScan } from ".";

export function getProgress(box) {
	if (!box?.scans || box?.scans?.length === 0) {
		return "noscans";
	}

	const lastFinalScan = getLastFinalScan(box);
	const lastReceivedScan = getLastMarkedAsReceivedScan(box);

	if (lastFinalScan) {
		if (lastReceivedScan) {
			return "validated";
		}
		return "delivered";
	}
	if (lastReceivedScan) {
		return "received";
	}
	return "inprogress";
}

export function getStatusPercentage(sample, status = "delivered") {
	sample.forEach(box => {
		box.progress = getProgress(box);
	});

	const deliveredBoxes = sample.filter(box => box.progress === status).length;

	return (deliveredBoxes / sample.length) * 100;
}

// export function calculateDeliveryPercentage(project) {
// 	const uniqueBoxIds = [...new Set(project.map(box => box.id))];

// 	const scans = project.reduce((accumulator, box) => {
// 		if (box.scans && Array.isArray(box.scans))
// 			return accumulator.concat(box.scans);
// 		return accumulator;
// 	}, []);

// 	const deliveredBoxes = uniqueBoxIds.reduce((count, boxId) => {
// 		const finalDestinationScan = scans.find(scan => scan.boxId === boxId && scan.finalDestination === true);
// 		if (finalDestinationScan) {
// 			count++;
// 		}
// 		return count;
// 	}, 0);

// 	const deliveryPercentage = (deliveredBoxes / project.length) * 100;

// 	return deliveryPercentage;
// }
