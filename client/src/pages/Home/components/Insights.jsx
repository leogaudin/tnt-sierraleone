import { useEffect, useState } from 'react';
import Timeline from './Timeline';
import { Card, Heading, HStack, Progress, Stack } from '@chakra-ui/react';
import { callAPI, progressColors } from '../../../service';
import { useTranslation } from 'react-i18next';
import { palette } from '../../../theme';
import Loading from '../../../components/Loading';

export default function Insights({ boxes, id }) {
	const [projects, setProjects] = useState([]);
	const { t } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [repartition, setRepartition] = useState({});

	const controller = new AbortController();
	const signal = controller.signal;

	useEffect(() => {
		const projects = [...new Set(boxes.map(box => box.project))];
		setProjects(projects);

		return () => controller.abort();
	}, [boxes]);

	return (
		<>
			{projects.map((project, i) => {
				const sample = boxes.filter(box => box.project === project);
				if (!sample) return null;

				callAPI('POST', 'repartition', { id, filters: { project } }, {}, signal)
					.then(res => res.json())
					.then(res => {
						setRepartition(res.data);
						setLoading(false);
					})
					.catch(error => {
						console.error(error);
					});

				if (loading) return <Loading />;

				const progress = (repartition.validated / repartition.total) * 100;

				return (
					<Card
						width='100%'
						direction='column'
						borderRadius={15}
						overflow='hidden'
						shadow='md'
					>
						<Stack
							marginTop={5}
							marginBottom={10}
						>
							<Heading
								size='md'
								paddingX={4}
								fontWeight='normal'
							>
								{project}
							</Heading>
							<Heading
								size='lg'
								paddingX={4}
								fontWeight='light'
							>
								<span style={{ fontWeight: 'bold' }}>{progress.toFixed(2)}%</span>
								{' '}{t('validated').toLowerCase()}
							</Heading>
							<Progress
								hasStripe
								isAnimated
								colorScheme='green'
								// bgColor={palette.success.main}
								size='sm'
								value={progress}
							/>
						</Stack>
						<Timeline
							key={i}
							project={project}
							id={id}
						/>
						<Stack
							// width='100%'
							align='center'
							textAlign='center'
							padding={5}
						>
							<Heading
								color={palette.gray.main}
								fontWeight='light'
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
		</>
	)
}
