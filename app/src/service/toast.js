import Toast from 'react-native-toast-message';

export function showToast(type, title, text) {
	Toast.show({
		type: type,
		text1: title,
		text2: text,
		topOffset: 60,
	});
}
