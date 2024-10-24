import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callAPI, fetchInsights } from '../../service';
import Insights from '../Home/components/Insights';
import BoxesLoading from '../../components/BoxesLoading';
import { Heading } from '@chakra-ui/react';

export default function PublicInsights() {
	const { id } = useParams();
	const [insights, setInsights] = useState(null);
	const [unauthorized, setUnauthorized] = useState(false);

	useEffect(() => {
		callAPI('get', `public_insights/${id}`)
			.then((res) => res.json())
			.then((response) => {
				if (response.publicInsights) {
					fetchInsights(id, setInsights);
				} else {
					setUnauthorized(true);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [id]);

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
