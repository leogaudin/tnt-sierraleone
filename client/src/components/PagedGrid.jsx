import {
	Button,
	SimpleGrid,
	Stack,
	Text,
	Flex,
	Select,
} from '@chakra-ui/react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { palette } from '../theme';
import Pagination from './Pagination';

export default function PagedGrid({
	elements,
	renderElement,
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);

	const { t } = useTranslation();

	const pageSizes = [10, 20, 50, 100, 500];

	return (
		<Stack>
			<Flex
				direction='column'
				align='center'
				padding={2}
			>
				<Text fontWeight='bold'>
					{t('elementsPerPage')}
				</Text>
				<Select
					focusBorderColor={palette.primary.dark}
					value={pageSize}
					onChange={e => setPageSize(parseInt(e.target.value))}
					width={20}
				>
					{pageSizes.map(size => <option key={size} value={size}>{size}</option>)}
				</Select>
				<SimpleGrid
					columns={{ base: 1, lg: 2 }}
					spacing={5}
					width='100%'
					marginY={5}
					alignItems='center'
				>
					{elements.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize
					).map(renderElement)}
				</SimpleGrid>
				<Pagination
					length={elements.length}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					pageSize={pageSize}
				/>
			</Flex>
		</Stack>
	)
}
