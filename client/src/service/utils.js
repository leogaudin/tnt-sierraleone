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
