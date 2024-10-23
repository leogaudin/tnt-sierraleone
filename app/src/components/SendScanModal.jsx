import { useState, useEffect, useContext } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from '@react-native-community/geolocation';
import styles from '../theme/styles';
import SparkMD5 from 'spark-md5';
import { showToast } from '../service/toast';
import { Modal, Text, TextInput, Portal, Button } from 'react-native-paper';
import { sendScan } from '../service/api';
import AppContext from '../context';

export default function SendScanModal({ modalVisible, setModalVisible, data }) {
	const [locationLoaded, setLocationLoaded] = useState(false);
	const [userLocation, setUserLocation] = useState();
	const [componentMounted, setComponentMounted] = useState(false);
	const [comment, setComment] = useState('');
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const { login, hasInternetConnection, setOfflineData } = useContext(AppContext);

	useEffect(() => {
		setComponentMounted(true);
	}, []);

	const handleSubmit = () => {
		setLocationLoaded(false);
		const scan = {
			id: '',
			boxId: data,
			operatorId: login,
			time: Date.now(),
			location: userLocation,
			markedAsReceived: toggleCheckBox,
			comment: comment,
		};
		scan.id = SparkMD5.hash(JSON.stringify(scan));
		setModalVisible(false);
		resetData();
		if (hasInternetConnection) {
			sendScan(scan)
				.catch(err => {
					setOfflineData((prev) => [...prev, scan]);
				});
		} else {
			setOfflineData((prev) => [...prev, scan]);
			showToast(
				'info',
				'No internet connection',
				'Scan will be sent when connection is restored',
			);
		}
	};

	if (!locationLoaded && componentMounted) {
		Geolocation.getCurrentPosition(
			position => {
				setUserLocation(position);
				setLocationLoaded(true);
			},
			error => {
				if (error.code === 3) {
					showToast('error', 'Timeout', 'The location search has timed out.');
				}
			},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: 10000
			},
		);
	}

	function resetData() {
		setLocationLoaded(false);
		setComment('');
		setToggleCheckBox(false);
	}

	return (
		<Portal>
			<Modal
				style={[styles.view]}
				visible={modalVisible}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<TouchableWithoutFeedback
						onPress={Keyboard.dismiss}
						accessible={false}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modal}>
								<Text style={[styles.title]}>
									Box n°{data}
								</Text>
								{!(locationLoaded && componentMounted)
									? <Text>Determining current location...</Text>
									: null
								}
								<TextInput
									mode='outlined'
									value={comment}
									onChangeText={text => setComment(text)}
									style={{ width: '100%' }}
									placeholder='Add a comment...'
									maxLength={140}
								/>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginVertical: 15,
									}}>
									<CheckBox
										value={toggleCheckBox}
										onValueChange={newValue => setToggleCheckBox(newValue)}
										style={{ marginRight: 10 }}
										tintColors={{ true: '#007AFF', false: '#C7C7CC' }}
									/>
									<Text>Mark as received (HT only)</Text>
								</View>
								<View style={[styles.horizontal]}>
									<Button
										mode='outlined'
										style={{ margin: 5 }}
										onPress={() => {
											setModalVisible(false);
											resetData();
										}}>
										Cancel
									</Button>
									<Button
										disabled={!locationLoaded || !userLocation}
										mode='contained'
										style={{ margin: 5 }}
										onPress={handleSubmit}
									>
										Send
									</Button>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</Modal>
		</Portal>
	);
}
