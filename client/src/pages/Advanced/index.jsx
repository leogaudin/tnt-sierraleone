import { useContext, useState } from 'react'
import BoxFiltering from '../../components/BoxFiltering'
import About from './components/About'
import AppContext from '../../context'
import { Button, Divider, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { callAPI } from '../../service';

async function deleteBoxes(boxes) {
	const batchSize = 2500;
	const idsToDelete = boxes.map(box => box.id);
	let deletedCount = 0;

	for (let sent = 0; sent < idsToDelete.length; sent += batchSize) {
		const batchIds = idsToDelete.slice(sent, sent + batchSize);
		const response = await callAPI('DELETE', 'boxes', { deleteConditions: { id: { $in: batchIds } } });
		const json = await response.json();
		deletedCount += json.data.deletedCount || 0;
	}

	return { deletedCount };
}

export default function Advanced() {
	const { boxes } = useContext(AppContext);
	const [filtered, setFiltered] = useState(boxes);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { t } = useTranslation();

	const handleDelete = () => {
		deleteBoxes(filtered)
			.then((res) => {
				alert(`${res.deletedCount} boxes deleted`);
				window.location.reload();
			})
			.catch(console.error);
	}

	return (
		<>
			<Stack
				align='stretch'
			>
				<Heading>{t('delete')}</Heading>
				<BoxFiltering
					boxes={boxes}
					setFilteredBoxes={setFiltered}
				/>
				<Button
					colorScheme='red'
					variant='solid'
					onClick={onOpen}
				>
					Delete
				</Button>
				<ConfirmDialog
					message={t('deletePrompt')}
					onConfirm={handleDelete}
					isOpen={isOpen}
					onClose={onClose}
				/>
			</Stack>
			<Divider marginY={5} />
			<About />
		</>
	)
}
