import { Stack } from '@chakra-ui/react';
import InsightsController from './components/InsightsController';
import Insights from './components/Insights';
import { useContext } from 'react';
import AppContext from '../../context';
import { user } from '../../service';

export default function Home() {
	const { boxes } = useContext(AppContext);

	return (
		<Stack
			width='100%'
		>
			<InsightsController />
			<Insights boxes={boxes} id={user.id} />
		</Stack>
	);
}
