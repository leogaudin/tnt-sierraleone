import { Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { user } from '../service';
import AppContext from '../context';
import BoxesLoading from './BoxesLoading';

export default function RouteWrapper({ route }) {
	const navigate = useNavigate();
	const { loading } = useContext(AppContext);

	useEffect(() => {
		if (!route.public && !user) {
			navigate('/auth');
		}
	}, []);

	return (
		<Flex
			width='100%'
			height='100%'
			justify='center'
			align='center'
			direction='column'
			// padding={5}
		>
			{user && loading
				? <BoxesLoading />
				: <route.component />
			}
		</Flex>
	)
}
