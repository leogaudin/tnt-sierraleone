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

export default function PagedGrid({
	elements,
	renderElement,
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const { t } = useTranslation();

	const Pagination = () => {
		if (!elements?.length) return null;
		const totalPages = Math.ceil(elements.length / pageSize);
		if (totalPages <= 1) return null;
		const pages = Array.from(Array(totalPages).keys()).map(page => page + 1);

		const ThreeDots = () => {
			return (
				<Button
					variant='outline'
					bg={palette.background}
					color={palette.primary.dark}
					disabled
				>
					...
				</Button>
			)
		}


		return (
			<Stack
				direction='row'
				justify='center'
			>
				<Button
					variant='outline'
					bg={palette.background}
					color={palette.primary.dark}
					disabled={currentPage === 1}
					onClick={() => setCurrentPage(currentPage - 1)}
				>
					{'<'}
				</Button>
				{pages.map(page => {
					if (
						page === 2 && currentPage > 3
						|| page === totalPages - 1 && currentPage < totalPages - 2
					)
						return <ThreeDots key={page} />;
					if (!(
						(page === 1 || page === totalPages)	// Page is not the first or the last
						|| (page === currentPage || page === currentPage + 1 || page === currentPage - 1) // Page is the current or one next to the current
					))
						return null;
					return (
						<Button
							variant={currentPage === page ? 'solid' : 'outline'}
							key={page}
							onClick={() => setCurrentPage(page)}
							bg={currentPage === page ? palette.primary.dark : palette.background}
							color={currentPage === page ? palette.background : palette.primary.dark}
							_hover={{
								bg: palette.primary.dark,
								color: palette.background,
							}}
						>
							{page}
						</Button>
					);
				})}
				<Button
					variant='outline'
					bg={palette.background}
					color={palette.primary.dark}
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage(currentPage + 1)}
				>
					{'>'}
				</Button>
			</Stack>
		)
	}

	const pageSizes = [10, 20, 50, 100];

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
					columns={{ base: 1, lg: 3 }}
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
				<Pagination />
			</Flex>
		</Stack>
	)
}
