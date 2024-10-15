import { useEffect, useState } from 'react';
import { excludedKeys, icons, progressColors } from '../service';
import {
	Select,
	IconButton,
	Stack,
	Flex,
	HStack,
	Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { palette } from '../theme';
import { getProgress } from '../service/stats';

export default function BoxFiltering({
	boxes,
	setFilteredBoxes
}) {
	const [filters, setFilters] = useState([]);
	const [progressFilter, setProgressFilter] = useState('any');
	const { t } = useTranslation();
	const excludedFields = [
		...excludedKeys,
		'createdAt',
	]

	const getFilteredBoxes = () => {
		return boxes?.filter((box) => {
			return (
				(filters.length === 0 || filters.every((filter) => box[filter.field] === filter.value))
				&&
				(getProgress(box) === progressFilter || progressFilter === 'any')
			)
		})
	}

	useEffect(() => {
		const updateFilteredBoxes = () => {
			setFilteredBoxes(getFilteredBoxes());
		}

		updateFilteredBoxes();
	}, [boxes, filters, progressFilter, setFilteredBoxes]);

	const availableOptions = boxes?.length
		? Object.keys(boxes[0]).filter((field) => !excludedFields.includes(field))
		: null;

	const handleProgressChange = (event) => {
		setProgressFilter(event.target.value);
	}

	const addFilter = () => {
		if (filters.every((filter) => filter.field && filter.value))
			setFilters([...filters, { field: '', value: '' }]);
	}

	const removeFilter = (index) => {
		setFilters(filters.filter((_, i) => i !== index));
	}

	const handleFieldChange = (index, event) => {
		const newFilters = [...filters];
		newFilters[index].field = event.target.value;
		setFilters(newFilters);
	}

	const isPossible = (filters, field, value) => {
		const newFilters = [...filters];
		const existingFilter = newFilters.findIndex((filter) => filter.field === field); // Check if the field is already selected
		const index = existingFilter === -1 ? newFilters.length : existingFilter; // If it is, replace it, otherwise add a new filter
		newFilters[index] = { field, value };
		return boxes.some((box) => newFilters.every((filter) => box[filter.field] === filter.value));
	}

	const handleValueChange = (index, event) => {
		const newFilters = [...filters];
		newFilters[index].value = event.target.value;
		setFilters(newFilters);
	}

	const FilterSelect = ({ filter, index }) => {
		return (
			<HStack
				bg={palette.gray.light}
				borderRadius={15}
				padding={2.5}
			>
				<Select
					defaultValue={filter.field}
					placeholder={filter.field || t('select', { option: t('field') })}
					onChange={(event) => handleFieldChange(index, event)}
					focusBorderColor={palette.primary.dark}
				>
					{/* <option key='blank' value=''>{t('select', { option: t('field') })}</option> */}
					{availableOptions.map((field) => {
						if (filters.some((filter) => filter.field === field)) return null;
						return (
							<option key={field} value={field} selected={filter.field === field}>
								{field}
							</option>
						)
					})}
				</Select>
				<Select
					defaultValue={filter.value}
					placeholder={filter.value || t('select', { option: t('value') })}
					onChange={(event) => handleValueChange(index, event)}
					focusBorderColor={palette.primary.dark}
				>
					{/* <option key='blank' value=''>{t('select', { option: t('value') })}</option> */}
					{Array.from(new Set(boxes.map((box) => box[filter.field]))).map((option) => {
						if (isPossible(filters, filter.field, option))
							return (
								<option key={option} value={option} selected={filter.value === option}>
									{option}
								</option>
							)
					})}
				</Select>
				<IconButton
					variant='outline'
					icon={<icons.delete />}
					onClick={() => removeFilter(index)}
					color={palette.error.main}
					borderColor={palette.error.main}
					bg='transparent'
				/>
			</HStack>
		)
	}

	return (
		<Stack
			justify='center'
			align='center'
			textAlign='center'
			padding={5}
			gap={2.5}
			bg={palette.gray.lightest}
			borderRadius={15}
		>
			<Text fontWeight='bold'>{t('filters')}</Text>
			<Flex
				justify='center'
				align='center'
				gap={2.5}
				wrap='wrap'
			>
				{/* Filters */}
				{filters.map((filter, index) => (
					<FilterSelect key={index} filter={filter} index={index} />
				))}
				<IconButton
					variant='outline'
					icon={<icons.plus />}
					onClick={addFilter}
					color={palette.primary.dark}
					borderColor={palette.primary.dark}
					bg='transparent'
				/>
			</Flex>
			<Text fontWeight='bold'>{t('progress')}</Text>
			<Select
				width='fit-content'
				defaultValue='any'
				onChange={handleProgressChange}
				focusBorderColor={palette.primary.dark}
				borderColor={palette.primary.light}
			>
				<option value='any'>{t('any')}</option>
				{Object.keys(progressColors).map((key) => (
					<option key={key} value={key}>
						{t(key)}
					</option>
				))}
			</Select>
			<Text
				fontSize='small'
				fontWeight='bold'
				// color={palette.gray.dark}
				textTransform='uppercase'
				marginY={5}
			>
				{t('itemsSelected', { count: getFilteredBoxes().length })}
			</Text>
		</Stack>
	)
}
