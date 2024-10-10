import { Flex } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navbarWidth, user } from '../service';
import AppContext from '../context';
import BoxesLoading from './BoxesLoading';
import Navbar from './Navbar';

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
			direction={{ base: 'column', md: 'row' }}
		>
			{user && <Navbar />}
			<Flex
				marginLeft={{ base: 0, md: user ? navbarWidth : 0 }}
				width='100%'
				height='100%'
				justify='center'
				direction='column'
				overflow='scroll'
				// padding={5}
			>
				{loading
					? <BoxesLoading />
					: <route.component />
				}
			</Flex>
		</Flex>
	)
}
