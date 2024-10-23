import { useContext, useState } from 'react';
import { View } from 'react-native';
import styles from '../theme/styles';
import Toast from 'react-native-toast-message';
import AppContext from '../context';
import SendScanModal from '../components/SendScanModal';
import OfflineScansModal from '../components/OfflineScansModal';
import IconButton from '../components/IconButton';
import Flashlight from '../components/svg/Flashlight';
import Offline from '../components/svg/Offline';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

export default function Scanner() {
	const device = useCameraDevice('back');

	const { hasCameraPermissions, hasLocationPermissions, loading } = useContext(AppContext);

	const [flash, setFlash] = useState(false);
	const [sendScanVisible, setSendScanVisible] = useState(false);
	const [offlineScansVisible, setOfflineScansVisible] = useState(false);
	const [data, setData] = useState('');
	const [active, setActive] = useState(true);

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes, frame) => {
			const code = codes[0];
			handleRead(code.value);
		}
	});

	const handleRead = (content) => {
		if (sendScanVisible || !active) return;
		setActive(false);
		if (content.startsWith('tnt://')) {
			content = content.replace('tnt://', '');
			setData(content);
			setSendScanVisible(true);
		}
		setTimeout(() => {
			setActive(true);
		}, 3000);
	};


	if (device == null)
		return <NoCameraDeviceError />;
	if (!(hasCameraPermissions && hasLocationPermissions) || loading)
		return null;

	return (
		<View>
			<Camera
				codeScanner={codeScanner}
				style={styles.camera}
				device={device}
				isActive={true}
				torch={flash ? 'on' : 'off'}
				photoQualityBalance='speed'
			/>
			<SendScanModal
				modalVisible={sendScanVisible}
				setModalVisible={setSendScanVisible}
				data={data}
			/>
			<OfflineScansModal
				visible={offlineScansVisible}
				onClose={() => setOfflineScansVisible(false)}
			/>
			<View style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginTop: 50,
			}}>
				<IconButton onPress={() => setOfflineScansVisible(true)} icon={<Offline />} />
				<IconButton onPress={() => setFlash(!flash)} icon={<Flashlight />} />
			</View>
			<Toast />
		</View>
	);
}
