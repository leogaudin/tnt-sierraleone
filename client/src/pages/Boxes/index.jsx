import { useContext } from 'react';
import AppContext from '../../context';
import PagedGrid from '../../components/PagedGrid';
import BoxCard from './components/BoxCard';

export default function Boxes() {
	const { boxes } = useContext(AppContext);

	return (
		<>
			<PagedGrid
				elements={boxes}
				renderElement={(box) => (
					<BoxCard box={box} key={box.id} />
				)}
			/>
		</>
	);
}
