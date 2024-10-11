import i18n from '../language';

export function timeAgo(time) {

	switch (typeof time) {
		case 'number':
			break;
		case 'string':
			time = +new Date(time);
			break;
		case 'object':
			if (time.constructor === Date) time = time.getTime();
			break;
		default:
			time = +new Date();
	}
	let time_formats = [
		[60, 'seconds', 1],
		[120, i18n.t('minutesAgo', { count: 1 }), i18n.t('minuteFromNow', { count: 1 })],
		[3600, 'minutes', 60],
		[7200, i18n.t('hoursAgo', { count: 1 }), i18n.t('hourFromNow', { count: 1 })],
		[86400, 'hours', 3600],
		[172800, i18n.t('yesterday'), i18n.t('tomorrow')],
		[604800, 'days', 86400],
		[1209600, i18n.t('lastWeek'), i18n.t('nextWeek')],
		[2419200, 'weeks', 604800],
		[4838400, i18n.t('lastMonth'), i18n.t('nextMonth')],
		[29030400, 'months', 2419200],
		[58060800, i18n.t('lastYear'), i18n.t('nextYear')],
		[2903040000, 'years', 29030400]
	];
	let seconds = (+new Date() - time) / 1000;

	if (seconds === 0) return i18n.t('justNow')

	if (seconds < 0) return i18n.t('future')

	let i = 0,
		format;
	while ((format = time_formats[i++]))
		if (seconds < format[0]) {
			if (typeof format[2] == 'string')
				return format[1];
			else {
				switch (format[1]) {
					case 'seconds':
						return i18n.t('secondsAgo', { count: Math.floor(seconds / format[2]) });
					case 'minutes':
						return i18n.t('minutesAgo', { count: Math.floor(seconds / format[2]) });
					case 'hours':
						return i18n.t('hoursAgo', { count: Math.floor(seconds / format[2]) });
					case 'days':
						return i18n.t('daysAgo', { count: Math.floor(seconds / format[2]) });
					case 'weeks':
						return i18n.t('weeksAgo', { count: Math.floor(seconds / format[2]) });
					case 'months':
						return i18n.t('monthsAgo', { count: Math.floor(seconds / format[2]) });
					case 'years':
						return i18n.t('yearsAgo', { count: Math.floor(seconds / format[2]) });
					default:
						return i18n.t('justNow');
				}
			}
		}

	return time;
}

export function haversineDistance(coord1, coord2) {
	const earthRadiusInMeters = 6378137;
	const { latitude: lat1, longitude: lon1 } = coord1;
	const { latitude: lat2, longitude: lon2 } = coord2;

	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = earthRadiusInMeters * c;

	return distance;
}

export function groupByProperty(boxes, propertyName) {
	return boxes.reduce((acc, box) => {
		const property = box[propertyName];
		if (!property) {
			return acc;
		}
		if (!acc[property]) {
			acc[property] = [];
		}
		acc[property].push(box);
		return acc;
	}, {});
}

/**
* @param latLngInDeg array of arrays with latitude and longtitude
*   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
*   [longtitude2] ...]
*
* @return array with the center latitude longtitude pairs in
*   degrees.
*/
export function getLatLngCenter(latLngInDegr) {
	function rad2degr(rad) { return rad * 180 / Math.PI; }
	function degr2rad(degr) { return degr * Math.PI / 180; }

	let LATIDX = 0;
	let LNGIDX = 1;
	let sumX = 0;
	let sumY = 0;
	let sumZ = 0;

	for (let i = 0; i < latLngInDegr.length; i++) {
		let lat = degr2rad(latLngInDegr[i][LATIDX]);
		let lng = degr2rad(latLngInDegr[i][LNGIDX]);
		// sum of cartesian coordinates
		sumX += Math.cos(lat) * Math.cos(lng);
		sumY += Math.cos(lat) * Math.sin(lng);
		sumZ += Math.sin(lat);
	}

	let avgX = sumX / latLngInDegr.length;
	let avgY = sumY / latLngInDegr.length;
	let avgZ = sumZ / latLngInDegr.length;

	// convert average x, y, z coordinate to latitude and longtitude
	let lng = Math.atan2(avgY, avgX);
	let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
	let lat = Math.atan2(avgZ, hyp);

	return ([rad2degr(lat), rad2degr(lng)]);
}

export function getZoomLevel(markerCoords) {
	const bounds = markerCoords.reduce(
		(acc, coord) => {
			return [
				[Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
				[Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])],
			];
		},
		[[Infinity, Infinity], [-Infinity, -Infinity]]
	);
	const distance = Math.sqrt(
		Math.pow(bounds[1][0] - bounds[0][0], 2) + Math.pow(bounds[1][1] - bounds[0][1], 2)
	);
	const zoomLevel = Math.log2(156543.03392 * 360 / distance / 200000);
	return Math.round(zoomLevel);
};

