import { palette } from '../theme';
import {
	Button,
	Stack,
} from '@chakra-ui/react';

export default function Pagination({
	length,
	currentPage,
	setCurrentPage,
	pageSize,
}) {
	if (!length || pageSize >= length)
		return null;
	const totalPages = Math.ceil(length / pageSize);
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
