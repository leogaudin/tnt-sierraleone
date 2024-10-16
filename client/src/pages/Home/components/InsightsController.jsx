import {
	Button,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/react'
import { callAPI, icons, user } from '../../../service/';
import { palette } from '../../../theme';
import { useTranslation } from 'react-i18next';

export default function InsightsController() {
	const { t } = useTranslation();
	const toast = useToast();

	return (
		<Stack
			borderRadius={15}
			bg={user.publicInsights ? palette.success.light : palette.error.light}
			padding={5}
			marginY={5}
			align='start'
			color={user.publicInsights ? palette.success.dark : palette.error.dark}
		>
			<Text>{t('yourInsightsAreCurrently')} {user.publicInsights ? t('public') : t('private')}.</Text>
			<Button
				size='sm'
				variant='outline'
				colorScheme={user.publicInsights ? 'green' : 'red'}
				onClick={() => {
					const id = user.id;
					const publicInsights = !user.publicInsights;
					callAPI('post', 'insights', { id, publicInsights })
						.then(() => {
							window.location.reload();
							user.publicInsights = publicInsights;
							localStorage.setItem('user', JSON.stringify(user));
						})
						.catch(() => {
							toast({
								title: 'Error updating visibility',
								status: 'error',
								duration: 1000,
								isClosable: true,
								position: 'top',
							})
						});
				}}
			>
				{t('make')} {user.publicInsights ? t('private') : t('public')}
			</Button>
			{user.publicInsights
				? <>
					<Text
						textTransform='uppercase'
						fontWeight='bold'
						fontSize='small'
						marginTop={5}
					>
						{t('accessLink')}
					</Text>
					<HStack
						width='100%'
						gap={5}
						fontSize='small'
						overflowWrap='anywhere'
						padding={2}
						borderRadius={15}
					>
						<Text
							width='100%'
							overflowWrap='anywhere'
							as='code'
						>
							{`${window.location.href}insights/${user.id}`}
						</Text>
						<IconButton
							variant='outline'
							icon={<icons.copy />}
							colorScheme={user.publicInsights ? 'green' : 'red'}
							width='100%'
							boxSize={10}
							onClick={() => {
								toast({
									title: t('copied'),
									status: 'success',
									duration: 1000,
									isClosable: true,
									position: 'top',
								})
								navigator.clipboard.writeText(`${window.location.href}insights/${user.id}`)
							}}
						/>
					</HStack>
				</>
				: null}
		</Stack>
	)
}
