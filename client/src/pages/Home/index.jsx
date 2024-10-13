import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context';
import Timeline from './components/Timeline';
import { groupByProperty } from '../../service/utils'
import { Card, Flex, Heading, HStack, Stack } from '@chakra-ui/react';
import { sampleToRepartition } from '../../service/stats';
import { progressColors } from '../../service';
import { useTranslation } from 'react-i18next';
import { palette } from '../../theme';

export default function Home() {
	const [groupedBoxes, setGroupedBoxes] = useState({});
	const { boxes } = useContext(AppContext);
	const { t } = useTranslation();

	useEffect(() => {
		if (boxes)
			setGroupedBoxes(groupByProperty(boxes, 'project'));
	}, [boxes]);

	return (
		<Stack
			width='100%'
		>
			{Object.keys(groupedBoxes).map((key, i) => {
				const sample = groupedBoxes[key];
				if (!sample) return null;

				const repartition = sampleToRepartition(sample);

				return (
					<Card
						width='100%'
						direction='column'
						borderRadius={15}
						overflow='hidden'
						shadow='md'
					>
						<Heading
							size='md'
							p={4}
						>
							{key}
						</Heading>
						<Flex
							height='400px'
						>
							<Timeline
								key={i}
								sample={sample}
							/>
						</Flex>
						<Stack
							// width='100%'
							align='center'
							padding={5}
						>
							<Heading
								color={palette.gray.main}
							>
								{t('currently')}
							</Heading>
							<HStack
								gap={5}
							>
								{Object.keys(repartition).map((key, i) => {
									return (
										<Stack
											color={progressColors[key]}
											align='center'
											key={key}
										>
											<Heading>
												{repartition[key]}
											</Heading>
											<Heading
												size='sm'
											>
												{t(key)}
											</Heading>
										</Stack>
									);
								})}
							</HStack>
						</Stack>
					</Card>
				);
			})}
		</Stack>
	);
}
