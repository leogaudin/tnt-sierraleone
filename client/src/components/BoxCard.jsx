import {
	Flex,
	Heading,
	ScaleFade,
	Card,
	CardBody,
	Text,
	Stack,
} from '@chakra-ui/react';
import { palette } from '../theme';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { haversineDistance } from '../service/utils';
import Pill from './Pill';
import { getProgress } from '../service/stats';
import { icons } from '../service';

export default function BoxCard({
	box,
}) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const lastScan = [...box.scans].sort((a, b) => {
		return new Date(b.time) - new Date(a.time);
	})[0] || null;

	const progress = getProgress(box);

	const progressColors = {
		noscans: palette.error.main,
		inprogress: palette.info.main,
		reachedgps: palette.warning.main,
		received: palette.warning.main,
		validated: palette.success.main,
	}

	const progressIcons = {
		noscans: <icons.close />,
		inprogress: <icons.clock />,
		reachedgps: <icons.pin />,
		received: <icons.eye />,
		validated: <icons.check />,
	}

	return (
		<Card
			overflow='hidden'
			borderRadius={15}
			width='100%'
			height='100%'
			direction='column'
			shadow='md'
			color={palette.text}
			onClick={() => navigate(`/box/${box.id}`)}
			cursor='pointer'
			_hover={{
				opacity: .7,
			}}
		>
			<ScaleFade in={true}>
				<Flex
					bg={palette.gray.light}
					justify='space-between'
					align='start'
					paddingX={5}
					paddingY={3}
				>
					<Stack>
						<Text>
							<code>{box.id}</code>{' '}
							{t('in')}{'  '}
							<span
								style={{
									fontWeight: 'bold',
								}}
							>
								{box.project}
							</span>
						</Text>
					</Stack>
				</Flex>
				<CardBody>
					<Flex
						flexDirection='row'
						justify='space-between'
					>
						<Stack
							maxWidth='60%'
						>
							<Heading
								size='lg'
							>
								<span
									style={{
										fontWeight: 'normal',
										fontSize: 'normal',
									}}
								>
									{t('to')}{' '}
								</span>
								{box.school}
							</Heading>
						</Stack>
						<Stack
							align='center'
						>
							<Pill
								variant='solid'
								text={t(progress)}
								color={progressColors[progress]}
								icon={progressIcons[progress]}
							/>
							{lastScan
								? (
									<Text
										fontWeight='normal'
										color={progressColors[progress]}
									>
										{Math.round(haversineDistance(
											{ latitude: lastScan.location.coords.latitude, longitude: lastScan.location.coords.longitude },
											{ latitude: box.schoolLatitude, longitude: box.schoolLongitude },
										) / 1000)} km {t('away')}
									</Text>
								)
								: (
									null
								)
							}
						</Stack>
					</Flex>
				</CardBody>
			</ScaleFade>
		</Card>
	)
}
