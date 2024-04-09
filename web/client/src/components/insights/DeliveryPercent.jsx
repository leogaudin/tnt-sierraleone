import React from 'react';
import { Typography, LinearProgress, Stack, SvgIcon, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import { getStatusPercentage } from '../../service/statistics';

export default function DeliveryPercent({ sample }) {
	const { t } = useTranslation();

	const percentages = [
		'validated',
	];
	return (
		<>
			{percentages.map((status, i) => {
				const percentage = parseFloat(getStatusPercentage(sample, status));
				return (
					<>
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							mb={2}
						>
							<Typography variant="h4" component="div" gutterBottom key={i}>
								{percentage.toFixed(2)}% <span style={{fontWeight: 200, fontSize: 'smaller'}}>{t(status).toLowerCase()}</span>
							</Typography>
							<Tooltip placement='top' title={t('validatedExplanation')}>
								<SvgIcon sx={{opacity: .7, cursor: 'pointer'}} fontSize={'.5rem'}>
									<InfoIcon />
								</SvgIcon>
							</Tooltip>
						</Stack>
						<LinearProgress color={'success'} variant="determinate" value={percentage} />
					</>
				);
			})}
		</>
	);
}
