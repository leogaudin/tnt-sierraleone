import { useContext } from 'react';
import {
	View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {
	Text,
	Button,
} from 'react-native-paper';
import styles from '../theme/styles';
import AppContext from '../context';

export default function AskPermissions() {
	const { hasCameraPermissions, hasLocationPermissions } = useContext(AppContext);

	if (hasCameraPermissions && hasLocationPermissions) return null;

	return (
		<View
			style={[
				styles.view,
				{
					backgroundColor: 'whitesmoke',
					padding: 30,
				},
			]}
		>
			<Text
				style={{
					textAlign: 'center',
					fontSize: 20,
				}}
			>
				This application needs access to the camera and location to launch. Please allow access to both and restart.
			</Text>
			<Button
				style={{ marginVertical: 15 }}
				mode='contained'
				onPress={() => RNRestart.restart()}>
				Check permissions again
			</Button>
		</View>
	);
}
