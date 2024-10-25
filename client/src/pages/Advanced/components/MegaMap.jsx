import { useContext, useEffect, useRef } from 'react';
import AppContext from '../../../context';
import { palette } from '../../../theme';
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getLatLngCenter, getZoomLevel } from '../../../service/utils';

export default function MegaMap() {
	const { boxes } = useContext(AppContext);
	const containerRef = useRef(null);

	const coords = boxes.reduce((acc, box) => {
		box.scans.forEach(scan => {
			acc.push([
				scan.location.coords.longitude,
				scan.location.coords.latitude,
			]);
		});
		return acc;
	}, []);

	const initMap = () => {
		// const center = getLatLngCenter(coords);
		// const zoom = getZoomLevel(coords);

		const map = new Map({
			container: containerRef.current,
			style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
			// center,
			// zoom,
		});
		map._container.style.width = '100%';
		return map;
	};

	const addMarkers = (map) => {
		const features = coords.map(coord => {
			return {
				type: 'Feature',
				properties: {
					// 'message': `${scan.operatorId}\n${new Date(scan.time).toUTCString()}\n${scan.comment}`,
					color: 'red',
					iconSize: [.1, .1],
				},
				geometry: {
					type: 'Point',
					coordinates: [
						coord[0],
						coord[1],
					]
				},
			};
		});

		const geojson = {
			'type': 'FeatureCollection',
			'features': features,
		};

		geojson.features.forEach((marker) => {
			const element = document.createElement('div');
			element.className = 'marker';
			const style = {
				width: `${marker.properties.iconSize[0]}px`,
				height: `${marker.properties.iconSize[1]}px`,
				padding: '10px',
				borderRadius: '50%',
				// border: `1.5px solid ${marker.properties.color}`,
				backgroundColor: marker.properties.color,
				// cursor: 'pointer',
			};
			Object.keys(style).forEach(key => {
				element.style[key] = style[key];
			});

			// element.onclick = () => {
			// 	window.alert(marker.properties.message);
			// };

			new Marker({ element })
				.setLngLat(marker.geometry.coordinates)
				.addTo(map);
		});
	};

	useEffect(() => {
		const map = initMap();
		addMarkers(map);
		// addLines(map);
	}, [containerRef]);

	return (
		<div
			id='map'
			style={{
				borderRadius: 10,
				height: 900,
			}}
			ref={containerRef}
		>

		</div>
	);
}
