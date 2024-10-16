import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callAPI, fetchBoxes } from '../../service';
import Insights from '../Home/components/Insights';
import BoxesLoading from '../../components/BoxesLoading';
import { Heading } from '@chakra-ui/react';

export default function PublicInsights() {
	const { id } = useParams();
	const [boxes, setBoxes] = useState(null);
	const [unauthorized, setUnauthorized] = useState(false);

	useEffect(() => {
		callAPI('get', `insights/${id}`)
			.then((res) => res.json())
			.then((response) => {
				if (response.publicInsights) {
					fetchBoxes(id, setBoxes)
				} else {
					setUnauthorized(true);
				}
			})
			.catch((error) => {
				console.log(error);
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
			{boxes?.length
				? <Insights boxes={boxes} />
				: <BoxesLoading />
			}
		</>
	);
}
