import {
	Flex,
	Heading,
	ScaleFade,
	Card,
	CardBody,
	Text,
	Stack,
	useDisclosure,
} from '@chakra-ui/react';
import { palette } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { haversineDistance } from '../../../service/utils';
import Pill from '../../../components/Pill';
import { getProgress } from '../../../service/stats';
import { icons, progressColors } from '../../../service';
import BoxModal from './BoxModal';

export default function BoxCard({
	box,
}) {
	const { t } = useTranslation();
	const { onOpen, onClose, isOpen } = useDisclosure();

	const lastScan = [...box.scans].sort((a, b) => {
		return new Date(b.time) - new Date(a.time);
	})[0] || null;

	const progress = getProgress(box);

	const progressIcons = {
		noScans: <icons.close />,
		inProgress: <icons.clock />,
		reachedGps: <icons.pin />,
		received: <icons.eye />,
		validated: <icons.check />,
	}

	const progressColor = progressColors[progress];

	return (
		<>
			<BoxModal
				box={box}
				onClose={onClose}
				isOpen={isOpen}
			/>
			<Card
				overflow='hidden'
				borderRadius={15}
				width='100%'
				height='100%'
				direction='column'
				shadow='md'
				color={palette.text}
				onClick={onOpen}
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
									size='md'
									fontWeight='light'
								>
									{t('to')}{' '}
									<span
										style={{
											fontWeight: 'bold',
										}}
									>
										{box.school}
									</span>
								</Heading>
							</Stack>
							<Stack
								align='center'
							>
								<Pill
									variant='solid'
									text={t(progress)}
									color={progressColor}
									icon={progressIcons[progress]}
								/>
								{lastScan
									? (
										<Text
											fontWeight='normal'
											color={progressColor}
											opacity={.8}
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
		</>
	)
}
