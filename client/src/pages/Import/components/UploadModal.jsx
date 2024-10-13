import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { palette } from '../../../theme';
import { handleDistributionList } from '../../../service/csv';

export default function UploadModal({
	isOpen,
	file,
}) {
	if (!file) return null;
	const [output, setOutput] = useState([]);
	const { t } = useTranslation();

	useEffect(() => {
		handleDistributionList(file, setOutput)
	}, [file]);

	return (
		<Modal
			isOpen={isOpen}
			size='xl'
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader
					fontWeight='bold'
				>
					{t('addBoxes')}
				</ModalHeader>
				<ModalBody>
					{output?.length
						? (
							<Flex
								bg={palette.text}
								color={palette.background}
								padding={5}
								borderRadius={10}
								overflowY='scroll'
								maxHeight='70vh'
								direction='column'
							>
								{output?.map((line, i) => {
									return (
										<code
											style={{ maxWidth: '100%' }}
											key={i}
											ref={el => (i === output.length - 1) && el?.scrollIntoView()}
										>
											{line}
										</code>
									)
								})}
							</Flex>
						)
						: null
					}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
