import { useEffect, useState } from 'react';
import {
	Flex,
	Box,
	Stack,
	IconButton,
	Image,
	useMediaQuery,
	Heading,
	Text,
	Icon,
} from '@chakra-ui/react';
import { palette } from '../theme';
import { HamburgerIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { navbarWidth, routes, user } from '../service';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [isMobile] = useMediaQuery('(max-width: 48em)');

	const { t } = useTranslation();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navLinks = routes.filter((route) => route.inNav);

	const current = window.location.pathname;

	const NavItems = ({ navLinks }) => (
		<>
			{navLinks.map((nav) => (
				<Link to={nav.path}>
					<Flex
						key={nav.path}
						onClick={() => {
							setToggle(false);
						}}
						as='li'
						fontWeight='medium'
						fontSize='18px'
						color={current === nav.path
							? palette.background
							: palette.primary.dark
						}
						bg={current === nav.path
							? palette.primary.dark
							: 'transparent'
						}
						_hover={{
							opacity: .75,
						}}
						transition={'.25s'}
						paddingX={7}
						paddingY={3.5}
						borderRadius={15}
						width='100%'
						justify='start'
					>
						<Icon as={nav.icon} w={6} h={6} marginRight={5} />
						{nav.title}
					</Flex>
				</Link>
			))}
		</>
	);

	if (isMobile)
		return (
			<Flex
				as='nav'
				alignItems='center'
				p={5}
				width='100%'
				bg={palette.background}
			>
				<Flex
					width='100%'
					mx='auto'
					justifyContent='space-between'
					alignItems='center'
				>
					<Box
						display={{ base: 'flex', md: 'none' }}
						flex={1}
						justifyContent='flex-end'
						alignItems='center'
					>
						<IconButton
							alt='menu'
							objectFit='contain'
							onClick={() => setToggle(!toggle)}
							variant='unstyled'
							bg={palette.primary.dark}
							color={palette.background}
							icon={toggle ? <SmallCloseIcon /> : <HamburgerIcon />}
						/>
						<Box
							display={toggle ? 'flex' : 'none'}
							p={5}
							position='absolute'
							top='60px'
							right={0}
							mx={4}
							my={2}
							minW='140px'
							bg={palette.background}
							borderWidth={2}
							borderColor={palette.primary.dark}
							borderRadius={20}
							zIndex={10}
						>
							<Stack
								as='ul'
								listStyleType='none'
								justifyContent='flex-end'
								alignItems='flex-start'
								flex={1}
								direction='column'
								gap={5}
							>
								<NavItems navLinks={navLinks} />
							</Stack>
						</Box>
					</Box>
				</Flex>
			</Flex>
		);
	else
		return (
			<Flex
				as='nav'
				align='start'
				position='fixed'
				left={0}
				height='100vh'
				width={navbarWidth}
				bg={scrolled ? palette.background : 'transparent'}
				color={palette.primary.dark}
				overflow='auto'
			>
				<Flex
					width='100%'
					mx='auto'
					justify='center'
				>
					{/* <Link
						href='#'
						onClick={() => {
							window.scrollTo(0, 0);
						}}
						display='flex'
						gap={2}
						opacity={.7}
						_hover={{
							opacity: 1,
						}}
					>
						<Image src={logo} alt='logo' w={10} h={10} objectFit='contain' />
					</Link> */}
					<Stack
						as='ul'
						listStyleType='none'
						display={{ base: 'none', md: 'flex' }}
						direction='column'
						align='stretch'
						gap={5}
					>
						<Stack
							align='center'
							marginY={42}
							fontSize={'small'}
						>
							<Text>{t('loggedInAs')}</Text>
							<Heading
								fontSize='inherit'
							>
								{user.email}
							</Heading>
						</Stack>
						<NavItems navLinks={navLinks} />
					</Stack>
				</Flex>
			</Flex>
		);
}
