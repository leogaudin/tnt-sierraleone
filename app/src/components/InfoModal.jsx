import { TouchableOpacity, View } from 'react-native';
import styles from '../theme/styles';
import { Modal, Portal, Text, Button } from 'react-native-paper';

const InfoModal = ({ visible, onClose, title, children }) => {
	return (
		<Portal>
			<Modal visible={visible} style={styles.view}>
				<View style={styles.modalContainer}>
					<View style={styles.modal}>
						<Text style={styles.title}>
							{title}
						</Text>
						{children}
						<TouchableOpacity onPress={onClose}>
							<Button
								mode='outlined'
								style={{ margin: 20 }}
							>
								Close
							</Button>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default InfoModal;
