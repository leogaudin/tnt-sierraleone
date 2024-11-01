import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAllBoxes } from '../../service';
import Insights from '../Home/components/Insights';
import BoxesLoading from '../../components/BoxesLoading';
import { Heading } from '@chakra-ui/react';
import { computeInsights } from '../../service/stats';

export default function PublicInsights() {
	const { id } = useParams();
	const [insights, setInsights] = useState(null);
	const [unauthorized, setUnauthorized] = useState(false);

	useEffect(() => {
		fetchAllBoxes(id, () => {})
			.then((boxes) => {
				if (!boxes?.length)
					throw Error('Unauthorized')
				computeInsights(boxes, setInsights)
			})
			.catch(setUnauthorized(true))
	}, [id])

	if (unauthorized)
		return (
			<Heading>
				<code>
					Unauthorized
				</code>
			</Heading>
		);

	return (
		<>
			{insights
				? <Insights insights={insights} />
				: <BoxesLoading />
			}
		</>
	);
}
