import { useState, useContext, useRef } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import {
	Button,
	Modal,
	Portal,
	Text,
} from 'react-native-paper';
import PhoneInput from 'react-native-phone-input';
import styles from '../theme/styles';
import { storeString } from '../service/storage';
import AppContext from '../context';
import { loginKey } from '../constants';

export default function Login() {
	const [number, setNumber] = useState('');
	const [isNumberValid, setIsNumberValid] = useState(true);
	const { login, setLogin } = useContext(AppContext);
	const phone = useRef(null);

	return (
		<Portal>
			<Modal
				style={styles.view}
				visible={login === undefined}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<TouchableWithoutFeedback
						onPress={Keyboard.dismiss}
						accessible={false}>
						<View style={styles.modalContainer}>
							<View style={styles.modal}>
								<Text style={styles.title}>Enter your phone number</Text>
								<PhoneInput
									style={{ width: '100%' }}
									ref={ref => phone.current = ref}
									allowZeroAfterCountryCode={true}
									initialCountry='fr'
									initialValue='+33742424242'
									autoFormat={true}
									textProps={{
										style: {
											marginVertical: 15,
											fontSize: 20,
											textAlign: 'left',
											color: '#000',
											paddingVertical: 0
										},
									}}
									flagStyle={{ marginLeft: 55 }}
									onChangePhoneNumber={text => {
										setIsNumberValid(phone.current.isValidNumber());
										setNumber(phone.current.getValue());
									}}
									onPressFlag={() => { }}
								/>
								<Button
									style={{ marginVertical: 15 }}
									mode='contained'
									onPress={() => {
										storeString(loginKey, number);
										setLogin(number);
									}}
									disabled={!isNumberValid || number === ''}>
									Login
								</Button>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</Modal>
		</Portal>
	);
}
