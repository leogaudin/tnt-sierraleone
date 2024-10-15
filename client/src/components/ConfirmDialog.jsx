import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';

export default function ConfirmDialog({
	message,
	onConfirm,
	isOpen,
	onClose,
}) {
	const { t } = useTranslation();

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t('confirmAction')}</ModalHeader>
				<ModalBody>{message}</ModalBody>
				<ModalFooter gap={2}>
					<Button variant='outline' onClick={onClose}>{t('cancel')}</Button>
					<Button variant='solid' onClick={handleConfirm} colorScheme='red'>{t('confirm')}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
