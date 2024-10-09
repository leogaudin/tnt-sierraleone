import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RouteWrapper({ route }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (!route.public && !localStorage.getItem('user')) {
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
			<route.component />
		</Flex>
	)
}
